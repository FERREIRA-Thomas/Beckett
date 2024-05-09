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
    const overlay = document.getElementById('overlay');
    audios.forEach(audio => {
        audio.pause(); // Mettre en pause tous les sons
        audio.currentTime = 0; // Remettre la lecture au début
        document.querySelector('.controls-container').classList.add('hidden');
        document.querySelector('.timeline').classList.add('hidden');
         document.querySelector('.parole-text-container').classList.add('hidden');
         document.querySelector('.overlay').classList.add('hidden');
         document.getElementById('video').style.marginLeft = '0%';
         document.querySelector('.controls-container').classList.remove('slide-timeline');

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
    const panelSummaryTitle = document.getElementById('summarytitle');
    const panelSummary2 = document.getElementById('panelSummary2');
    const panelTitle2 = document.getElementById('panelTitle2');

    paroleTextContainer.style.fontFamily = "'Courier New', Courier, monospace";
    panelTitle.style.fontFamily = "'Courier New', Courier, monospace";
    panelAuthors.style.fontFamily = "'Courier New', Courier, monospace";
    panelSummary.style.fontFamily = "'Courier New', Courier, monospace";
    panelLink.style.fontFamily = "'Courier New', Courier, monospace";
    panelsummaryTitle.style.fontFamily = "'Courier New', Courier, monospace";
     panelSummary2.style.fontFamily = "'Courier New', Courier, monospace";
     panelTitle2.style.fontFamily = "'Courier New', Courier, monospace";



    // Tableau contenant les titres, les auteurs, les résumés et les liens pour chaque audio
    const panelContents = [
        {
            title: 'Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu',
            authors: 'Caroline Granger et Anna Chirescu', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Dans cet entretien, nous nous concentrons, tout d’abord, sur l’expérience d’Anna Chirescu en tant que danseuse des chorégraphies de Merce Cunningham. Ses mots éclairent la spécificité de leurs reconstructions et l’engagement que celles-ci impliquent. Ensuite, nous interrogeons les outils mis en place par le chorégraphe afin d’échapper à une vision anthropocentrique. Nous discutons de l’influence de son attention portée aux animaux, et plus généralement aux non-humains et de son extraordinaire sens du temps dans l’élaboration de ses pièces. Par la suite, Anna explique comment ces éléments transmettent une sensation d’un « devenir autre ». En 2022, elle décide de créer VACA comme une poursuite de sa rencontre sensible avec les œuvres du chorégraphe. Cet entretien eut lieu quelques semaines avant la première. Il montre dans quelle mesure nos différentes approches s’entremêlent et révèlent combien nos expériences des chorégraphies de Merce Cunningham nous amènent à ressentir et à repenser nos relations aux animaux, aux non-humains et au vivant.', // Ajoutez le résumé ici
            link: 'https://journals.openedition.org/danse/6763' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu',
            authors: 'Caroline Granger et Anna Chirescu', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Dans cet entretien, nous nous concentrons, tout d’abord, sur l’expérience d’Anna Chirescu en tant que danseuse des chorégraphies de Merce Cunningham. Ses mots éclairent la spécificité de leurs reconstructions et l’engagement que celles-ci impliquent. Ensuite, nous interrogeons les outils mis en place par le chorégraphe afin d’échapper à une vision anthropocentrique. Nous discutons de l’influence de son attention portée aux animaux, et plus généralement aux non-humains et de son extraordinaire sens du temps dans l’élaboration de ses pièces. Par la suite, Anna explique comment ces éléments transmettent une sensation d’un « devenir autre ». En 2022, elle décide de créer VACA comme une poursuite de sa rencontre sensible avec les œuvres du chorégraphe. Cet entretien eut lieu quelques semaines avant la première. Il montre dans quelle mesure nos différentes approches s’entremêlent et révèlent combien nos expériences des chorégraphies de Merce Cunningham nous amènent à ressentir et à repenser nos relations aux animaux, aux non-humains et au vivant.', // Ajoutez le résumé ici
            link: 'https://journals.openedition.org/danse/6763' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu',
            authors: 'Caroline Granger et Anna Chirescu', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Dans cet entretien, nous nous concentrons, tout d’abord, sur l’expérience d’Anna Chirescu en tant que danseuse des chorégraphies de Merce Cunningham. Ses mots éclairent la spécificité de leurs reconstructions et l’engagement que celles-ci impliquent. Ensuite, nous interrogeons les outils mis en place par le chorégraphe afin d’échapper à une vision anthropocentrique. Nous discutons de l’influence de son attention portée aux animaux, et plus généralement aux non-humains et de son extraordinaire sens du temps dans l’élaboration de ses pièces. Par la suite, Anna explique comment ces éléments transmettent une sensation d’un « devenir autre ». En 2022, elle décide de créer VACA comme une poursuite de sa rencontre sensible avec les œuvres du chorégraphe. Cet entretien eut lieu quelques semaines avant la première. Il montre dans quelle mesure nos différentes approches s’entremêlent et révèlent combien nos expériences des chorégraphies de Merce Cunningham nous amènent à ressentir et à repenser nos relations aux animaux, aux non-humains et au vivant.', // Ajoutez le résumé ici
            link: 'https://journals.openedition.org/danse/6763' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu',
            authors: 'Caroline Granger et Anna Chirescu', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Dans cet entretien, nous nous concentrons, tout d’abord, sur l’expérience d’Anna Chirescu en tant que danseuse des chorégraphies de Merce Cunningham. Ses mots éclairent la spécificité de leurs reconstructions et l’engagement que celles-ci impliquent. Ensuite, nous interrogeons les outils mis en place par le chorégraphe afin d’échapper à une vision anthropocentrique. Nous discutons de l’influence de son attention portée aux animaux, et plus généralement aux non-humains et de son extraordinaire sens du temps dans l’élaboration de ses pièces. Par la suite, Anna explique comment ces éléments transmettent une sensation d’un « devenir autre ». En 2022, elle décide de créer VACA comme une poursuite de sa rencontre sensible avec les œuvres du chorégraphe. Cet entretien eut lieu quelques semaines avant la première. Il montre dans quelle mesure nos différentes approches s’entremêlent et révèlent combien nos expériences des chorégraphies de Merce Cunningham nous amènent à ressentir et à repenser nos relations aux animaux, aux non-humains et au vivant.', // Ajoutez le résumé ici
            link: 'https://journals.openedition.org/danse/6763' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Des battements d’ailes aux ruminations d’une vache. Un entretien sur nos relations au vivant avec Anna Chirescu',
            authors: 'Caroline Granger et Anna Chirescu', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Dans cet entretien, nous nous concentrons, tout d’abord, sur l’expérience d’Anna Chirescu en tant que danseuse des chorégraphies de Merce Cunningham. Ses mots éclairent la spécificité de leurs reconstructions et l’engagement que celles-ci impliquent. Ensuite, nous interrogeons les outils mis en place par le chorégraphe afin d’échapper à une vision anthropocentrique. Nous discutons de l’influence de son attention portée aux animaux, et plus généralement aux non-humains et de son extraordinaire sens du temps dans l’élaboration de ses pièces. Par la suite, Anna explique comment ces éléments transmettent une sensation d’un « devenir autre ». En 2022, elle décide de créer VACA comme une poursuite de sa rencontre sensible avec les œuvres du chorégraphe. Cet entretien eut lieu quelques semaines avant la première. Il montre dans quelle mesure nos différentes approches s’entremêlent et révèlent combien nos expériences des chorégraphies de Merce Cunningham nous amènent à ressentir et à repenser nos relations aux animaux, aux non-humains et au vivant.', // Ajoutez le résumé ici
            link: 'https://journals.openedition.org/danse/6763' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Revendication, récupération, correction... lorsqu’un chorégraphe décide d’écrire sa propre histoire : le cas de l’autobiographie de Mikhaïl Fokine',
            authors: 'Mariko Kitahara', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Cet article envisage de mettre en lumière comment un danseur intervient dans la construction ou la déconstruction de sa propre histoire. Notre analyse porte sur le chorégraphe Mikhaïl Fokine (1880-1942) et son autobiographie, rédigée à partir de 1937 et publiée en 1961 à titre posthume. Grâce à ses correspondances avec Cyril Beaumont, un de ses biographes, et avec Oliver Sayler, éditeur de son autobiographie de son vivant, conservées au Victoria & Albert Museum de Londres, nous pouvons retracer son engagement dans les controverses sur l’histoire de la danse, d’abord en tant que conseiller/réviseur pour ses biographes, puis en tant qu’auteur de sa propre histoire. Sa frustration face aux mémoires rédigées par d’autres sur son art, son désir presque obsessionnel de les « corriger », sont symptomatiques de la nouvelle génération du ballet du XXe siècle, ancrée dans l’originalité d’un chorégraphe-créateur, dont il était un des pionniers.',
            link: 'https://journals.openedition.org/danse/6728' // Ajoutez le lien du texte intégral ici
        },

        {
            title: 'Pour un usage de l’entretien d’explicitation ou micro-phénoménologique avec une interprète de Mohini Attam. Retour sur une recherche en cours',
            authors: 'Federica Fratagnoli', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'L’article retrace les points clés d’une recherche en cours, soutenue par l’« Aide à la recherche et au patrimoine en danse » du Centre national de la danse (CN D) en 2022. Il interroge l’utilisation d’une technique d’entretien – l’entretien d’explicitation ou micro- phénoménologique – qui a été mobilisé au sein du projet avec une interprète française de Mohini Attam, Brigitte Chataignier. Après avoir situé méthodologiquement ce choix et présenté la technique d’entretien, l’article s’attardera sur la lecture d’un certain nombre d’extraits d’un entretien réalisé avec cette interprète. Ses paroles aideront à comprendre en quoi cette technique permet une verbalisation fine de l’expérience dansée et à avancer des hypothèses sur la place et l’importance de la figure du maître dans ce style de danse.', // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Pour un usage de l’entretien d’explicitation ou micro-phénoménologique avec une interprète de Mohini Attam. Retour sur une recherche en cours',
            authors: 'Federica Fratagnoli', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'L’article retrace les points clés d’une recherche en cours, soutenue par l’« Aide à la recherche et au patrimoine en danse » du Centre national de la danse (CN D) en 2022. Il interroge l’utilisation d’une technique d’entretien – l’entretien d’explicitation ou micro- phénoménologique – qui a été mobilisé au sein du projet avec une interprète française de Mohini Attam, Brigitte Chataignier. Après avoir situé méthodologiquement ce choix et présenté la technique d’entretien, l’article s’attardera sur la lecture d’un certain nombre d’extraits d’un entretien réalisé avec cette interprète. Ses paroles aideront à comprendre en quoi cette technique permet une verbalisation fine de l’expérience dansée et à avancer des hypothèses sur la place et l’importance de la figure du maître dans ce style de danse.',
            link: 'https://journals.openedition.org/danse/6748' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Pour un usage de l’entretien d’explicitation ou micro-phénoménologique avec une interprète de Mohini Attam. Retour sur une recherche en cours',
            authors: 'Federica Fratagnoli', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'L’article retrace les points clés d’une recherche en cours, soutenue par l’« Aide à la recherche et au patrimoine en danse » du Centre national de la danse (CN D) en 2022. Il interroge l’utilisation d’une technique d’entretien – l’entretien d’explicitation ou micro- phénoménologique – qui a été mobilisé au sein du projet avec une interprète française de Mohini Attam, Brigitte Chataignier. Après avoir situé méthodologiquement ce choix et présenté la technique d’entretien, l’article s’attardera sur la lecture d’un certain nombre d’extraits d’un entretien réalisé avec cette interprète. Ses paroles aideront à comprendre en quoi cette technique permet une verbalisation fine de l’expérience dansée et à avancer des hypothèses sur la place et l’importance de la figure du maître dans ce style de danse.',
            link: 'https://journals.openedition.org/danse/6748' // Ajoutez le lien du texte intégral ici
        },

        {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ?</br> Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },

                {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ?</br> Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },

                {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ?</br> Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },

                {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ?</br> Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },

             {
            title: 'En résonance d’une conférence sensible',
            authors: 'Lulla Chourlin et Sarath Amarasingam', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Le texte vise à présenter les enjeux de savoirs sensibles du corps en restituant des écrits qui ont constitué les protocoles de recherche et de création d’une performance intitulée Conférence sensible, créée en 2018 avec le danseur Sarath Amarasingam et Lulla Chourlin, chorégraphe praticienne enseignante en Body-Mind Centering® (BMC®). Le propos de cette Conférence sensible était de questionner ce que la pratique somatique du BMC® apporte au danseur pour affiner sa danse. Différents dispositifs faisant émerger la parole et l’écriture « avant-pendant-après » l’expérience des touchers et des danses ont été mis en place et exposés au public. Sont partagés ici six textes issus de ce processus de recherche-création, l’ensemble insistant sur l’importance d’une circulation de la sensation, du mouvement, de la parole orale et écrite pour qu’une incorporation sensible ait lieu au sein de la pratique du BMC® comme de la pratique de la danse.',
            link: 'https://journals.openedition.org/danse/6806' // Ajoutez le lien du texte intégral ici
        },

        {
            title: 'En résonance d’une conférence sensible',
            authors: 'Lulla Chourlin et Sarath Amarasingam', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Le texte vise à présenter les enjeux de savoirs sensibles du corps en restituant des écrits qui ont constitué les protocoles de recherche et de création d’une performance intitulée Conférence sensible, créée en 2018 avec le danseur Sarath Amarasingam et Lulla Chourlin, chorégraphe praticienne enseignante en Body-Mind Centering® (BMC®). Le propos de cette Conférence sensible était de questionner ce que la pratique somatique du BMC® apporte au danseur pour affiner sa danse. Différents dispositifs faisant émerger la parole et l’écriture « avant-pendant-après » l’expérience des touchers et des danses ont été mis en place et exposés au public. Sont partagés ici six textes issus de ce processus de recherche-création, l’ensemble insistant sur l’importance d’une circulation de la sensation, du mouvement, de la parole orale et écrite pour qu’une incorporation sensible ait lieu au sein de la pratique du BMC® comme de la pratique de la danse.',
            link: 'https://journals.openedition.org/danse/6806' // Ajoutez le lien du texte intégral ici
        },

        {
            title: 'En résonance d’une conférence sensible',
            authors: 'Lulla Chourlin et Sarath Amarasingam', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Le texte vise à présenter les enjeux de savoirs sensibles du corps en restituant des écrits qui ont constitué les protocoles de recherche et de création d’une performance intitulée Conférence sensible, créée en 2018 avec le danseur Sarath Amarasingam et Lulla Chourlin, chorégraphe praticienne enseignante en Body-Mind Centering® (BMC®). Le propos de cette Conférence sensible était de questionner ce que la pratique somatique du BMC® apporte au danseur pour affiner sa danse. Différents dispositifs faisant émerger la parole et l’écriture « avant-pendant-après » l’expérience des touchers et des danses ont été mis en place et exposés au public. Sont partagés ici six textes issus de ce processus de recherche-création, l’ensemble insistant sur l’importance d’une circulation de la sensation, du mouvement, de la parole orale et écrite pour qu’une incorporation sensible ait lieu au sein de la pratique du BMC® comme de la pratique de la danse.',
            link: 'https://journals.openedition.org/danse/6806' // Ajoutez le lien du texte intégral ici
        },

        {
            title: 'En résonance d’une conférence sensible',
            authors: 'Lulla Chourlin et Sarath Amarasingam', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Le texte vise à présenter les enjeux de savoirs sensibles du corps en restituant des écrits qui ont constitué les protocoles de recherche et de création d’une performance intitulée Conférence sensible, créée en 2018 avec le danseur Sarath Amarasingam et Lulla Chourlin, chorégraphe praticienne enseignante en Body-Mind Centering® (BMC®). Le propos de cette Conférence sensible était de questionner ce que la pratique somatique du BMC® apporte au danseur pour affiner sa danse. Différents dispositifs faisant émerger la parole et l’écriture « avant-pendant-après » l’expérience des touchers et des danses ont été mis en place et exposés au public. Sont partagés ici six textes issus de ce processus de recherche-création, l’ensemble insistant sur l’importance d’une circulation de la sensation, du mouvement, de la parole orale et écrite pour qu’une incorporation sensible ait lieu au sein de la pratique du BMC® comme de la pratique de la danse.',
            link: 'https://journals.openedition.org/danse/6806' // Ajoutez le lien du texte intégral ici
        },

            //audio 18-19
        {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

        {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         //audio 20-23
         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },
        //audio 24

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },
        //audio 25,26,27,27

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

        //audio 29-30

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

        //audio 31-32

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

        //audio 33,34,35,36

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

        //audio 37,38,39,40

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

        //audio 41,42,43

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },


        //audio 44,45,46,47

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

        //audio 48, 49, 50, 51

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
        },

         {
            title: 'Lorem Ipsum',
            authors: 'Lorem Ipsum', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            link: '' // Ajoutez le lien du texte intégral ici
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
            "Paroles de Alessandra Randazzo <br>—</p>ARTICLE référent de</br>Alessandra Randazzo et David Zambrano</p><i>Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Karine Saporta <br>—</p>ARTICLE référent de</br>Pauline Boivineau et Claire Rousier</p><i>L’entretien sur commande : les enjeux de la parole chez Karine Saporta</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Karine Saporta <br>—</p>ARTICLE référent de</br>Pauline Boivineau et Claire Rousier</p><i>L’entretien sur commande : les enjeux de la parole chez Karine Saporta</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Karine Saporta <br>—</p>ARTICLE référent de</br>Pauline Boivineau et Claire Rousier</p><i>L’entretien sur commande : les enjeux de la parole chez Karine Saporta</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Camille Casale <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Camille Casale <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Camille Casale <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Jules Thomas <br>—</p>ARTICLE référent de</br>Camille Casale</p><i>Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mathieu Bouvier <br>—</p>ARTICLE référent de</br>Mathieu Bouvier</p><i>Gestes de parole</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mathieu Bouvier <br>—</p>ARTICLE référent de</br>Mathieu Bouvier</p><i>Gestes de parole</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mathieu Bouvier <br>—</p>ARTICLE référent de</br>Mathieu Bouvier</p><i>Gestes de parole</i></p><a href=\"#\">En lire plus</a>",
            "Paroles de Mathieu Bouvier <br>—</p>ARTICLE référent de</br>Mathieu Bouvier</p><i>Gestes de parole</i></p><a href=\"#\">En lire plus</a>",

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
        panelAuthors.textContent = `${authors}`; // Afficher les noms des auteurs
        panelSummary.textContent = summary;
        panelLink.setAttribute('href', link);

        document.getElementById('video').style.marginLeft = '-20%';
    document.querySelectorAll('.flexbox').forEach(flexbox => {
    flexbox.style.marginRight = '-30%';
    });

        document.querySelector('.controls-container').classList.add('slide-timeline');

        setTimeout(() => {
            overlay.classList.remove('hidden');
             overlay2.classList.add('hidden');
            overlay.classList.add('slide-in');
        }, 120);
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
        document.querySelector('.controls-container').classList.remove('slide-timeline');

        document.getElementById('video').style.marginLeft = '0%';
    document.querySelectorAll('.flexbox').forEach(flexbox => {
        flexbox.style.marginRight = '0%';
    });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const creditText = document.querySelector('.credit');
    const closeButton2 = document.getElementById('closeButton2');
    const panelTitle2 = document.getElementById('panelTitle2');
    const panelSummary2 = document.getElementById('panelSummary2');
    const overlay1 = document.getElementById('overlay');
    const overlay2 = document.getElementById('overlay2');
    const triangles = document.querySelectorAll('.triangle');
    const title1 = document.querySelector('.title1'); // Correction du sélecteur
    const title2 = document.querySelector('.title2'); // Correction du sélecteur
    const credit = document.querySelector('.credit'); // Correction du sélecteur
    const paroleTextContainer = document.querySelector('.parole-text-container'); // Correction du sélecteur
    const controlsContainer = document.querySelector('.controls-container');
    const audios = document.querySelectorAll('audio');

    creditText.addEventListener('click', function() {
        overlay1.classList.add('hidden');
        overlay2.classList.remove('hidden');
        paroleTextContainer.classList.add('blur');
        credit.classList.add('blur');
        controlsContainer.classList.add('blur');
        audios.forEach(audio => {
        audio.pause();
        triangles.forEach(triangle => {
            triangle.classList.add('blur');
        });
        // Mettre en pause le son
        
        // Déplacer les éléments vers la gauche lorsque l'overlay est ouvert
        moveElementsLeft();
    });

    closeButton2.addEventListener('click', function() {
        overlay2.classList.add('hidden');
        paroleTextContainer.classList.remove('blur');
        controlsContainer.classList.remove('blur');
        credit.classList.remove('blur');
        triangles.forEach(triangle => {
            triangle.classList.remove('blur');
        });
        // Réinitialiser les marges lorsque l'overlay est fermé
        resetElementMargins();
    });

    function moveElementsLeft() {
    title1.style.marginLeft = '360px';
    title2.style.marginLeft = '360px';
    controlsContainer.style.left = '1080px'; // Calcul de la position horizontale
    controlsContainer.style.width = '80%';
    paroleTextContainer.style.marginLeft = '240px';
    // Ajoutez d'autres éléments si nécessaire
}

function resetElementMargins() {
    title1.style.marginLeft = '0';
    title2.style.marginLeft = '0';
    controlsContainer.style.left = '926px';
    controlsContainer.style.width = '90%';
    paroleTextContainer.style.marginLeft = '0';
    // Réinitialisez d'autres éléments si nécessaire
}
});


document.getElementById("pauseButton").addEventListener("click", function() {
    this.classList.toggle("clicked");
    playButton.classList.toggle("clicked")
});

document.getElementById("playButton").addEventListener("click", function() {
    this.classList.toggle("clicked")
    pauseButton.classList.toggle("clicked")
});
});
