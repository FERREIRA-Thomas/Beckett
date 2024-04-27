document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const totalTriangles = 51;
    const numFlexbox = 17;

    // Créer les triangles et les ajouter à la page
    const triangles = [];
    for (let i = 0; i < totalTriangles; i++) {
        const triangle = document.createElement('div');
        triangle.className = `triangle triangle-${i + 1}`;
        triangle.dataset.index = i + 1; // Index pour le système audio
        triangles.push(triangle);
        container.appendChild(triangle);
    }

    // Ajouter cet événement après la boucle for qui crée les triangles
    let currentAudio = null;
    for (let i = 0; i < totalTriangles; i++) {
        const triangle = triangles[i];
        triangle.addEventListener('click', function() {
            document.querySelector('.controls-container').classList.remove('hidden');
            document.querySelector('.timeline').classList.remove('hidden');
            const audioIndex = triangle.dataset.index;
            const audioElement = document.querySelector(`#audio${audioIndex}`);
            if (audioElement) {
                audioElement.currentTime = 0; // Réinitialiser l'audio au début
                audioElement.play();

                // Mettre en pause tous les autres éléments audio
                if (currentAudio && currentAudio !== audioElement) {
                    currentAudio.pause();
                }
                currentAudio = audioElement;

                // Mettre en pause la vidéo
                const video = document.getElementById('video');
                if (!video.paused) {
                    video.play();
                }
            }
        });
    }

    // Fonction pour créer une flexbox avec un nombre spécifique de triangles
    function createFlexbox(numTriangles, flexboxIndex) {
        const flexbox = document.createElement('div');
        flexbox.className = `flexbox flexbox-${flexboxIndex}`; // Ajouter une classe spécifique pour chaque flexbox
        flexbox.dataset.index = flexboxIndex;

        for (let i = 0; i < numTriangles; i++) {
            const triangle = triangles.shift(); // Récupérer le premier triangle du tableau
            if (triangle) {
                flexbox.appendChild(triangle);
            }
        }

        container.appendChild(flexbox);

        // Ajouter un événement de survol à la flexbox
        flexbox.addEventListener('mouseover', function() {
            // Appliquer un flou à toutes les autres flexbox
            document.querySelectorAll('.flexbox').forEach(otherFlexbox => {
                if (otherFlexbox !== flexbox) {
                    otherFlexbox.style.filter = 'blur(5px)';
                }
            });
        });

        // Retirer le flou lorsque le curseur quitte la flexbox
        flexbox.addEventListener('mouseout', function() {
            document.querySelectorAll('.flexbox').forEach(otherFlexbox => {
                otherFlexbox.style.filter = 'none';
            });
        });
    }

    // Générer des flexbox avec un nombre de triangles spécifique pour chaque flexbox
    const trianglesPerFlexbox = [5, 3, 1, 4, 3, 2, 4, 4, 2, 4, 4, 4, 2, 4, 2, 4, 1]; // Nombre de triangles pour chaque flexbox
    for (let i = 0; i < numFlexbox; i++) {
        createFlexbox(trianglesPerFlexbox[i], i + 1);
    }

    // Fonction pour déplacer manuellement une flexbox
    function moveFlexbox(flexboxIndex, position) {
        const flexbox = container.querySelector(`.flexbox[data-index="${flexboxIndex}"]`);
        if (flexbox) {
            container.insertBefore(flexbox, container.children[position]);
        }
    }
});

// Fonction pour mettre à jour la progression de la timeline
function updateTimeline(audio) {
    const progress = (audio.currentTime / audio.duration) * 100;
    timelineProgress.style.width = `${progress}%`;
}

// Mettre à jour la timeline lorsque la lecture audio progresse
document.querySelectorAll('audio').forEach(audio => {
    audio.addEventListener('timeupdate', () => {
        updateTimeline(audio);
    });
});

// Fonction pour mettre à jour la progression de la timeline
function updateTimeline(audio) {
    const progress = (audio.currentTime / audio.duration) * 100;
    const timelineProgress = document.querySelector('.timeline-progress');
    timelineProgress.style.width = `${progress}%`;
}

let pausedAudio = null; // Variable pour stocker le dernier son en pause

document.getElementById('playButton').addEventListener('click', function() {
    const audios = document.querySelectorAll('audio');
    let isPlaying = false;
    audios.forEach(audio => {
        if (audio.paused && audio === pausedAudio) {
            audio.play(); // Reprendre la lecture du dernier son en pause
            pausedAudio = null; // Réinitialiser la variable pour indiquer qu'aucun son n'est en pause
        } else if (!audio.paused) {
            isPlaying = true; // Indiquer qu'au moins un son est en cours de lecture
        }
    });
    const video = document.getElementById('video');
    if (video.paused) {
        video.play(); // Reprendre la lecture de la vidéo si elle est en pause
    } else if (isPlaying) {
        video.play(); // Reprendre la lecture de la vidéo s'il y a au moins un son en cours de lecture
    }
});

document.getElementById('pauseButton').addEventListener('click', function() {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        if (!audio.paused) {
            audio.pause(); // Mettre en pause tous les sons
            pausedAudio = audio; // Sauvegarder le dernier son en pause
        }
    });
    const video = document.getElementById('video');
    if (!video.paused) {
        video.pause(); // Mettre en pause la vidéo si elle est en cours de lecture
    }
});

document.getElementById('stopButton').addEventListener('click', function() {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        audio.pause(); // Mettre en pause tous les sons
        audio.currentTime = 0; // Remettre la lecture au début
        document.querySelector('.controls-container').classList.add('hidden');
        document.querySelector('.timeline').classList.add('hidden');
         document.querySelector('.parole-text-container').classList.add('hidden');
    });
    const video = document.getElementById('video');
    video.play(); // Mettre en pause la vidéo
    video.currentTime; // Remettre la lecture de la vidéo au début
});

document.addEventListener('DOMContentLoaded', function() {
    const triangles = document.querySelectorAll('.triangle');
    const flexboxes = document.querySelectorAll('.flexbox');

    // Fonction pour réinitialiser les triangles et le flou sur les flexbox
    function reset() {
        triangles.forEach(triangle => {
            triangle.classList.remove('active');
            triangle.style.transform = ''; // Réinitialiser la rotation
        });
    }

    triangles.forEach(triangle => {
        triangle.addEventListener('click', function() {
            reset();
            triangle.classList.add('active');
            const flexbox = triangle.parentElement;
            flexbox.style.filter = 'none'; // Annuler le flou sur la flexbox associée au triangle cliqué
            triangle.style.transform = 'rotate(35deg)'; // Rotation de 35 degrés au clic
            const audioIndex = triangle.dataset.index;
            const audio = document.querySelector(`#audio${audioIndex}`);
            if (audio) {
                audio.currentTime = 0; // Réinitialiser l'audio au début
                audio.play();
                audio.addEventListener('ended', function() {
                    reset();
                    triangle.style.transform = ''; // Réinitialiser la rotation lorsque l'audio se termine
                });
            }
        });
    });

    // Réinitialiser les triangles et le flou lorsque le bouton stop est cliqué
    document.getElementById('stopButton').addEventListener('click', reset);
});

document.addEventListener('DOMContentLoaded', function() {
    const triangles = document.querySelectorAll('.triangle');
    const paroleTextContainer = document.querySelector('.parole-text-container');
    const overlay = document.getElementById('overlay');
    const panelTitle = document.getElementById('panelTitle');
    const panelContent = document.getElementById('panelContent');
    const closeButton = document.getElementById('closeButton');

    // Tableau contenant les titres et les paragraphes pour chaque audio
    const panelContents = [
        {
            title: 'Titre pour le triangle 1',
            text: 'Contenu spécifique pour le triangle 1.'
        },
        {
            title: 'Titre pour le triangle 2',
            text: 'Contenu spécifique pour le triangle 2.'
        },
        // Ajouter les titres et les paragraphes pour chaque audio
    ];

    // Fonction pour afficher le texte général et le lien "En lire plus" pour le triangle cliqué
    function showParoleText(triangleIndex) {
        const generalTexts = [
            "Parole de: Dupont et Dupont <br> Dans un trou vivait un hobbit </br><a href=\"#\">En lire plus</a>",
            "Texte pour le triangle 2 <br> Dans un trou vivait un hobbit </br><a href=\"#\">En lire plus</a>",
            // Ajoutez le texte général pour chaque triangle
        ];
        paroleTextContainer.innerHTML = generalTexts[triangleIndex - 1];
        paroleTextContainer.classList.remove('hidden');

        // Ajouter un gestionnaire d'événement au lien "En lire plus"
        const link = paroleTextContainer.querySelector('a');
        if (link) {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Empêcher le comportement par défaut du lien hypertexte

                // Récupérer le titre et le paragraphe spécifiques à cet audio
                const { title, text } = panelContents[triangleIndex - 1];

                // Mettre à jour le titre et le contenu du panneau
                panelTitle.textContent = title;
                panelContent.textContent = text;

                // Afficher le panneau
                overlay.classList.remove('hidden');
            });
        }
    }

    // Ajouter un événement de clic à chaque triangle
    triangles.forEach(triangle => {
        triangle.addEventListener('click', function() {
            const triangleIndex = triangle.dataset.index;
            showParoleText(triangleIndex);
            // Votre autre logique pour la lecture audio, etc.
        });
    });

    // Ajouter un gestionnaire d'événement au bouton de fermeture du panneau
    closeButton.addEventListener('click', function() {
        overlay.classList.add('hidden');
    });
});
