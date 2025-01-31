const { exec, spawn } = require('child_process');

// Fonction pour exécuter une commande shell et renvoyer une promesse
const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur: ${stderr}`);
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

// Fonction pour démarrer un processus en arrière-plan et attendre sa fin
const spawnProcess = (command, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: true });
    child.on('error', (error) => {
      console.error(`Erreur lors du démarrage du processus: ${error.message}`);
      reject(error);
    });
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Le processus s'est terminé avec le code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

// Fonction pour vérifier que le serveur écoute sur un port donné
const waitForServer = (port) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      execCommand(`curl --silent --head --fail http://localhost:${port}`)
        .then(() => {
          clearInterval(interval);
          resolve();
        })
        .catch((error) => {
          console.log(`Le serveur n'est pas encore disponible sur le port ${port}. Nouvelle tentative...`);
        });
    }, 1000); // Vérifier toutes les secondes
  });
};

const startServer = async () => {
  try {
    console.log('Démarrage des conteneurs Docker...');
    await execCommand('docker-compose up -d');

    console.log('Attente de 2 secondes pour que MySQL démarre...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Démarrage du serveur Node.js...');
    // Démarre le serveur et attends qu'il termine
    await spawnProcess('node', ['backend/Server.js']);

    console.log('Attente de la disponibilité du serveur sur le port 5000...');
    // Attend que le serveur soit prêt avant de continuer
    await waitForServer(5000);

    console.log('Le serveur est en cours d\'exécution.');

  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1); // Exit avec un code d'erreur pour indiquer l'échec de la tâche
  }
};

// Lancer le serveur et attendre la fin de la tâche
startServer().then(() => {
  console.log('Démarrage du serveur terminé avec succès');
}).catch((error) => {
  console.error('Erreur dans le démarrage du serveur:', error);
});
