import jwt from 'jsonwebtoken';

// 1. Generazione del Token JWT per l'autenticazione delle sessioni
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      // CORREZIONE: Unisce nome e cognome nativi del modello per evitare valori undefined nel token
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'qualcosa-di-super-segreto', // Fallback di sicurezza se manca la variabile nel .env
    {
      expiresIn: '30d', // Il token scadrà dopo 30 giorni
    },
  );
};

// 2. OTTIMIZZAZIONE FONDAMENTALE: Middleware per proteggere le rotte sensibili (es. invio ordini)
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    // Estrae il token saltando la stringa iniziale "Bearer " (7 caratteri)
    const token = authorization.slice(7, authorization.length);

    jwt.verify(
      token,
      process.env.JWT_SECRET || 'qualcosa-di-super-segreto',
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Token non valido o scaduto' });
        } else {
          // Inietta i dati decodificati dell'utente dentro req.user a beneficio delle rotte successive
          req.user = decode;
          next(); // Autorizza il passaggio al controller successivo
        }
      },
    );
  } else {
    res.status(401).send({ message: 'Nessun token di autenticazione fornito' });
  }
};
