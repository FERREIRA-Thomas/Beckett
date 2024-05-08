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
    const trianglesPerFlexbox = [5, 1, 3, 4, 4, 2, 4, 1, 4, 2, 2, 4, 4, 3, 4, 4]; // Nombre de triangles pour chaque flexbox
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
    const panelAuthors = document.getElementById('panelAuthors'); // Nouveau élément pour afficher les noms des auteurs
    const panelSummary = document.getElementById('panelSummary'); // Nouveau élément pour afficher le résumé
    const panelLink = document.getElementById('panelLink'); // Nouveau élément pour le lien du texte intégral
    const closeButton = document.getElementById('closeButton');

    // Tableau contenant les titres, les auteurs, les résumés et les liens pour chaque audio
    const panelContents = [
        {
            title: 'Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu',
            authors: 'Caroline Granger et Anna Chirescu', // Ajoutez les noms des auteurs ici
            summary: 'Dans cet entretien, nous nous concentrons, tout d’abord, sur l’expérience d’Anna Chirescu en tant que danseuse des chorégraphies de Merce Cunningham. Ses mots éclairent la spécificité de leurs reconstructions et l’engagement que celles-ci impliquent. Ensuite, nous interrogeons les outils mis en place par le chorégraphe afin d’échapper à une vision anthropocentrique. Nous discutons de l’influence de son attention portée aux animaux, et plus généralement aux non-humains et de son extraordinaire sens du temps dans l’élaboration de ses pièces. Par la suite, Anna explique comment ces éléments transmettent une sensation d’un « devenir autre ». En 2022, elle décide de créer VACA comme une poursuite de sa rencontre sensible avec les œuvres du chorégraphe. Cet entretien eut lieu quelques semaines avant la première. Il montre dans quelle mesure nos différentes approches s’entremêlent et révèlent combien nos expériences des chorégraphies de Merce Cunningham nous amènent à ressentir et à repenser nos relations aux animaux, aux non-humains et au vivant.', // Ajoutez le résumé ici
            link: 'https://journals.openedition.org/danse/6763' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Titre pour le triangle 2',
            authors: 'Auteur 3, Auteur 4', // Ajoutez les noms des auteurs ici
            summary: 'Résumé du contenu pour le triangle 2.', // Ajoutez le résumé ici
            link: 'lien_vers_texte_integral2.html' // Ajoutez le lien du texte intégral ici
        },
        // Ajoutez les titres, les auteurs, les résumés et les liens pour chaque audio
    ];

    // Fonction pour afficher le texte Parole de: et le lien "En lire plus"
    function showParoleText(triangleIndex) {
        const generalTexts = [
            "Paroles d'Anna Chirescu <br>—</p>ARTICLE référent de</br>Caroline Granger et Anna Chirescu</p><i>Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anna Chirescu <br>—</p>ARTICLE référent de</br>Caroline Granger et Anna Chirescu</p><i>Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anna Chirescu <br>—</p>ARTICLE référent de</br>Caroline Granger et Anna Chirescu</p><i>Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anna Chirescu <br>—</p>ARTICLE référent de</br>Caroline Granger et Anna Chirescu</p><i>Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anna Chirescu <br>—</p>ARTICLE référent de</br>Caroline Granger et Anna Chirescu</p><i>Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mariko Kitahara <br>—</p>ARTICLE référent de</br>Mariko Kitahara</p><i>Revendication, récupération, correction... lorsqu’un chorégraphe décide d’écrire sa propre histoire : le cas de l’autobiographie de Mikhaïl Fokine</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Brigitte Chataignier, Federica Fratagnoli <br>—</p>ARTICLE référent de</br>Federica Fratagnoli</p><i>Pour un usage de l’entretien d’explicitation ou micro- phénoménologique avec une interprète de Mohini Attam. Retour sur une recherche en cours</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Brigitte Chataignier, Federica Fratagnoli <br>—</p>ARTICLE référent de</br>Federica Fratagnoli</p><i>Pour un usage de l’entretien d’explicitation ou micro- phénoménologique avec une interprète de Mohini Attam. Retour sur une recherche en cours</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Federica Fratagnoli <br>—</p>ARTICLE référent de</br>Federica Fratagnoli</p><i>Pour un usage de l’entretien d’explicitation ou micro-phénoménologique avec une interprète de Mohini Attam. Retour sur une recherche en cours</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Geisha Fontaine <br>—</p>ARTICLE référent de</br>Geisha Fontaine</p>Dans le sillage de trois performances de Trisha Brown et de Deborah Hay</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Geisha Fontaine <br>—</p>ARTICLE référent de</br>Geisha Fontaine</p>Dans le sillage de trois performances de Trisha Brown et de Deborah Hay</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Geisha Fontaine <br>—</p>ARTICLE référent de</br>Geisha Fontaine</p>Dans le sillage de trois performances de Trisha Brown et de Deborah Hay</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Geisha Fontaine <br>—</p>ARTICLE référent de</br>Geisha Fontaine</p>Dans le sillage de trois performances de Trisha Brown et de Deborah Hay</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Lulla Chourlin <br>—</p>ARTICLE référent de</br>Lulla Chourlin et Sarath Amarasingam</p><i>En résonance d’une conférence sensible</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Lulla Chourlin <br>—</p>ARTICLE référent de</br>Lulla Chourlin et Sarath Amarasingam</p><i>En résonance d’une conférence sensible</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Lulla Chourlin <br>—</p>ARTICLE référent de</br>Lulla Chourlin et Sarath Amarasingam</p><i>En résonance d’une conférence sensible</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Lulla Chourlin <br>—</p>ARTICLE référent de</br>Lulla Chourlin et Sarath Amarasingam</p><i>En résonance d’une conférence sensible</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Barbara Manzetti <br>—</p>ARTICLE référent de</br>Marian del Valle, Antia Díaz Otero, Elisabeth Maesen et Barbara Manzetti</p><i>Danser la disparition. Poursuivre l’élan des danses</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Marian del Valle <br>—</p>ARTICLE référent de</br>Marian del Valle, Antia Díaz Otero, Elisabeth Maesen et Barbara Manzetti</p><i>Danser la disparition. Poursuivre l’élan des danses</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anatoli Vlassov <br>—</p>ARTICLE référent de</br>Anatoli Vlassov</p><i>Manifeste de la Phonésie. Pour un « nouveau » art de rencontre entre danse et poésie</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anatoli Vlassov <br>—</p>ARTICLE référent de</br>Anatoli Vlassov</p><i>Manifeste de la Phonésie. Pour un « nouveau » art de rencontre entre danse et poésie</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anatoli Vlassov <br>—</p>ARTICLE référent de</br>Anatoli Vlassov</p><i>Manifeste de la Phonésie. Pour un « nouveau » art de rencontre entre danse et poésie</i></p><a href=\"#\">En lire plus</a>",
            "Paroles d'Anatoli Vlassov <br>—</p>ARTICLE référent de</br>Anatoli Vlassov</p><i>Manifeste de la Phonésie. Pour un « nouveau » art de rencontre entre danse et poésie</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Thais Meirelles Parelli <br>—</p>ARTICLE référent de</br>Thais Meirelles Parelli</p><i>Un regard sur Le Sacre du printemps « d’après Nijinski » de Dominique Brun à travers la parole de Loup Marcault, danseur de l’Opéra de Paris</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Sara Aggazio <br>—</p>ARTICLE référent de</br>Eléa Lauret-Baussay</p><i>Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Sara Aggazio <br>—</p>ARTICLE référent de</br>Eléa Lauret-Baussay</p><i>Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Sara Aggazio <br>—</p>ARTICLE référent de</br>Eléa Lauret-Baussay</p><i>Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Sara Aggazio <br>—</p>ARTICLE référent de</br>Eléa Lauret-Baussay</p><i>Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Marie-Jane Otth <br>—</p>ARTICLE référent de</br>Julia Wehren</p><i>Écouter les mouvements de la mémoire de l’autre</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Marie-Jane Otth <br>—</p>ARTICLE référent de</br>Julia Wehren</p><i>Écouter les mouvements de la mémoire de l’autre</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Maëlle Rousselot <br>—</p>ARTICLE référent de</br>Maëlle Rousselot et Éléonore Guérineau</p><i>Parler de danse classique. Les images sensorielles d’Éléonore Guérineau</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Maëlle Rousselot <br>—</p>ARTICLE référent de</br>Maëlle Rousselot et Éléonore Guérineau</p><i>Parler de danse classique. Les images sensorielles d’Éléonore Guérineau</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Fabienne Berger <br>—</p>ARTICLE référent de</br>Fabienne Berger et Julia Wehren</p><i>Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Fabienne Berger <br>—</p>ARTICLE référent de</br>Fabienne Berger et Julia Wehren</p><i>Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Fabienne Berger <br>—</p>ARTICLE référent de</br>Fabienne Berger et Julia Wehren</p><i>Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Fabienne Berger <br>—</p>ARTICLE référent de</br>Fabienne Berger et Julia Wehren</p><i>Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de David Zambrano <br>—</p>ARTICLE référent de</br>Alessandra Randazzo et David Zambrano</p><i>Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de David Zambrano <br>—</p>ARTICLE référent de</br>Alessandra Randazzo et David Zambrano</p><i>Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de David Zambrano <br>—</p>ARTICLE référent de</br>Alessandra Randazzo et David Zambrano</p><i>Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de David Zambrano <br>—</p>ARTICLE référent de</br>Alessandra Randazzo et David Zambrano</p><i>Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Karine Saporta <br>—</p>ARTICLE référent de</br>Pauline Boivineau et Claire Rousier</p><i>L’entretien sur commande : les enjeux de la parole chez Karine Saporta</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Karine Saporta <br>—</p>ARTICLE référent de</br>Pauline Boivineau et Claire Rousier</p><i>L’entretien sur commande : les enjeux de la parole chez Karine Saporta</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Karine Saporta <br>—</p>ARTICLE référent de</br>Pauline Boivineau et Claire Rousier</p><i>L’entretien sur commande : les enjeux de la parole chez Karine Saporta</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Camille Casale <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Camille Casale <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Camille Casale <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Camille Casale <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mathieu Bouvier <br>—</p>ARTICLE référent de</br>Mathieu Bouvier</p><i>Gestes de parole</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mathieu Bouvier <br>—</p>ARTICLE référent de</br>Mathieu Bouvier</p><i>Gestes de parole</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mathieu Bouvier <br>—</p>ARTICLE référent de</br>Mathieu Bouvier</p><i>Gestes de parole</i></p><a href=\"#\">En lire plus</a>",

            "Texte pour le triangle 2 <br> Dans un trou vivait un hobbit </br><a href=\"#\">En lire plus</a>",

            // Ajoutez le texte général pour chaque triangle
        ];
        paroleTextContainer.innerHTML = generalTexts[triangleIndex - 1];
        paroleTextContainer.classList.remove('hidden');

        const link = paroleTextContainer.querySelector('a');
        if (link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();

        // Récupérer les informations spécifiques à cet audio
        const { title, authors, summary, link } = panelContents[triangleIndex - 1];

        // Mettre à jour le titre et les auteurs du panneau
        panelTitle.textContent = title;
        panelAuthors.textContent = `Par: ${authors}`; // Afficher les noms des auteurs
        panelSummary.textContent = summary;
        panelLink.setAttribute('href', link);

        document.getElementById('video').style.marginLeft = '-20%';
    document.querySelectorAll('.flexbox').forEach(flexbox => {
    flexbox.style.marginRight = '-30%';
    });

        document.querySelector('.controls-container').classList.add('slide-timeline');

        setTimeout(() => {
            overlay.classList.remove('hidden');
            overlay.classList.add('slide-in');
        }, 110);
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
        overlay.classList.remove('slide-in');
        overlay.classList.add('hidden');
        document.querySelector('.controls-container').classList.remove('small');

        document.getElementById('video').style.marginLeft = '0';
    document.querySelectorAll('.flexbox').forEach(flexbox => {
        flexbox.style.marginRight = '0';
    });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const creditText = document.querySelector('.credit');
    const closeButton2 = document.getElementById('closeButton2');
    const panelTitle2 = document.getElementById('panelTitle2');
    const panelSummary2 = document.getElementById('panelSummary2');

    creditText.addEventListener('click', function() {
        overlay2.classList.remove('hidden');
    });
});


closeButton2.addEventListener('click', function() {
        overlay2.classList.add('hidden');
    });
