document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const totalTriangles = 51;
    const numFlexbox = 17;
    const stopButton = document.getElementById('stopButton');
    let activeTriangle = null; // Variable pour garder une référence au triangle actif

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
            document.getElementById('video').classList.remove('no-blur');
            document.getElementById('credit').classList.add('disabled');
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

                // Ajouter du flou à toutes les flexbox sauf celle contenant le triangle cliqué
                const clickedFlexbox = triangle.closest('.flexbox');
                document.querySelectorAll('.flexbox').forEach(flexbox => {
                    if (flexbox !== clickedFlexbox) {
                        flexbox.classList.add('blur');
                    }
                });

                // Désactiver tous les triangles sauf ceux de la flexbox cliquée
                triangles.forEach(t => {
                    if (!clickedFlexbox.contains(t)) {
                        t.classList.add('disabled');
                        t.style.pointerEvents = 'none'; // Empêche les clics sur les triangles désactivés
                    } else {
                        t.style.pointerEvents = ''; // Réactive les clics sur les triangles de la flexbox cliquée
                    }
                });

                // Ajouter la gestion de l'état actif
                if (activeTriangle) {
                    activeTriangle.classList.remove('active');
                }
                triangle.classList.add('active');
                activeTriangle = triangle;

                // Désactiver l'événement de survol des flexbox
                disableFlexboxHover();
            }
        });
    }

    // Fonction pour désactiver l'événement de survol des flexbox
    function disableFlexboxHover() {
        document.querySelectorAll('.flexbox').forEach(flexbox => {
            flexbox.removeEventListener('mouseover', addBlur);
            flexbox.removeEventListener('mouseout', removeBlur);
            flexbox.querySelectorAll('.triangle').forEach(triangle => {
                triangle.classList.add('disabled');
            });
        });
    }

    // Fonction pour réactiver l'événement de survol des flexbox
    function enableFlexboxHover() {
        document.querySelectorAll('.flexbox').forEach(flexbox => {
            flexbox.addEventListener('mouseover', addBlur);
            flexbox.addEventListener('mouseout', removeBlur);
            flexbox.querySelectorAll('.triangle').forEach(triangle => {
                triangle.classList.remove('disabled');
            });
        });
    }

    // Fonction pour ajouter du flou
    function addBlur(event) {
        document.querySelectorAll('.flexbox').forEach(otherFlexbox => {
            if (otherFlexbox !== event.currentTarget) {
                otherFlexbox.style.filter = 'blur(5px)';
                otherFlexbox.querySelectorAll('.triangle').forEach(triangle => {
                    triangle.classList.add('disabled');
                });
            }
        });
        const flexboxIndex = event.currentTarget.dataset.index;
        const paragraph = document.querySelector(`.paragraph-${flexboxIndex}`);
        if (paragraph) {
            paragraph.classList.remove('hidden');
        }
    }

    // Fonction pour retirer du flou
    function removeBlur() {
        document.querySelectorAll('.flexbox').forEach(flexbox => {
            flexbox.style.filter = 'none';
            flexbox.querySelectorAll('.triangle').forEach(triangle => {
                triangle.classList.remove('disabled');
            });
        });
                const flexboxIndex = event.currentTarget.dataset.index;
        const paragraph = document.querySelector(`.paragraph-${flexboxIndex}`);
        if (paragraph) {
            paragraph.classList.add('hidden');
        }
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
        flexbox.addEventListener('mouseover', addBlur);
        flexbox.addEventListener('mouseout', removeBlur);
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

    // Vérifier si stopButton est défini avant d'ajouter l'écouteur d'événement
     if (stopButton) {
        stopButton.addEventListener('click', function() {
            const audios = document.querySelectorAll('audio');
            const overlay = document.getElementById('overlay');
            const paragraph = document.getElementById('paragraph')
            paragraphs.forEach(paragraph => {
                paragraph.classList.add('hidden');
            audios.forEach(audio => {
                audio.pause(); // Mettre en pause tous les sons
                audio.currentTime = 0; // Remettre la lecture au début
                document.querySelector('.controls-container').classList.add('hidden');
                document.querySelector('.timeline').classList.add('hidden');
                document.querySelector('.parole-text-container').classList.add('hidden');
                document.querySelector('.overlay').classList.remove('slide-in');
                document.querySelector('.overlay').classList.add('slide-out');
                document.getElementById('video').style.marginLeft = '0%';
                document.getElementById('video').classList.remove('blur');
                document.getElementById('video').classList.add('no-blur');
                document.getElementById('credit').classList.remove('disabled');
                document.querySelector('.controls-container').classList.remove('slide-timeline');
                

                
            });
            const video = document.getElementById('video');
            video.play(); // Reprendre la lecture de la vidéo
            video.currentTime = 0; // Remettre la lecture de la vidéo au début

            // Retirer le flou immédiatement
            document.querySelectorAll('.flexbox').forEach(flexbox => {
                flexbox.classList.add('no-blur');
                flexbox.classList.remove('blur');
                flexbox.style.filter = 'none'; // Enlève également le style de filtre
            });

            // Réactiver tous les triangles
            triangles.forEach(triangle => {
                triangle.classList.remove('disabled');
                triangle.style.pointerEvents = '';
                triangle.classList.remove('blur');
                triangle.classList.add('no-blur');
                triangle.classList.remove('disabled'); // Réactiver les clics sur les triangles
            });

            // Réactiver l'événement de survol des flexbox
            enableFlexboxHover();

            // Ajouter la gestion de l'état "stopped"
            if (activeTriangle) {
                activeTriangle.classList.add('visited');
            }
        });
    });
    };

    // Mettre à jour la progression de la timeline lorsque la lecture audio progresse
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

    // Activer le survol des flexbox au chargement de la page
    enableFlexboxHover();
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
    const panelSummaryCredits = document.getElementById('panelSummaryCredits');
    const panelTitleCredits = document.getElementById('panelTitleCredits');
    const closeButtonCredits = document.getElementById('closeButtonCredits');
    const overlayCredits = document.getElementById('overlayCredits');

    paroleTextContainer.style.fontFamily = "'Courier New', Courier, monospace";
    panelTitle.style.fontFamily = "'Courier New', Courier, monospace";
    panelAuthors.style.fontFamily = "'Courier New', Courier, monospace";
    panelSummary.style.fontFamily = "'Courier New', Courier, monospace";
    panelLink.style.fontFamily = "'Courier New', Courier, monospace";
    panelsummaryTitle.style.fontFamily = "'Courier New', Courier, monospace";
    panelSummaryCredits.style.fontFamily = "'Courier New', Courier, monospace";
     panelTitleCredits.style.fontFamily = "'Courier New', Courier, monospace";


    // Tableau contenant les titres, les auteurs, les résumés et les liens pour chaque audio
    const panelContents = [

         // Panel pour Audio 1, 2, 3, 4, 5
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




         // Panel pour Audio 6
        {
            title: 'Revendication, récupération, correction... lorsqu’un chorégraphe décide d’écrire sa propre histoire : le cas de l’autobiographie de Mikhaïl Fokine',
            authors: 'Mariko Kitahara', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Cet article envisage de mettre en lumière comment un danseur intervient dans la construction ou la déconstruction de sa propre histoire. Notre analyse porte sur le chorégraphe Mikhaïl Fokine (1880-1942) et son autobiographie, rédigée à partir de 1937 et publiée en 1961 à titre posthume. Grâce à ses correspondances avec Cyril Beaumont, un de ses biographes, et avec Oliver Sayler, éditeur de son autobiographie de son vivant, conservées au Victoria & Albert Museum de Londres, nous pouvons retracer son engagement dans les controverses sur l’histoire de la danse, d’abord en tant que conseiller/réviseur pour ses biographes, puis en tant qu’auteur de sa propre histoire. Sa frustration face aux mémoires rédigées par d’autres sur son art, son désir presque obsessionnel de les « corriger », sont symptomatiques de la nouvelle génération du ballet du XXe siècle, ancrée dans l’originalité d’un chorégraphe-créateur, dont il était un des pionniers.',
            link: 'https://journals.openedition.org/danse/6728' // Ajoutez le lien du texte intégral ici
        },




        // Panel pour Audio 7, 8, 9 
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



        // Panel pour Audio 10, 11, 12, 13
        {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ? Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ?Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ? Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },
        {
            title: 'Troubles. Dans le sillage de trois performances de Trisha Brown et de Deborah Hay',
            authors: 'Geisha Fontaine', // Ajoutez les noms des auteurs ici
            summaryTitle: 'Résumé',
            summary: 'Danser ? Parler ? Créer ? Dans les années 1970, Trisha Brown et Deborah Hay proposent trois performances « historiques » appartenant incontestablement à l’histoire de la danse. Dans quelles revendications, approches critiques, ou simples pistes d’expérimentation, ces propositions se sont-elles opérées ? Qu’en est-il aujourd’hui ? Qu’est-ce que les mots sont à la danse ? Est-ce que chorégraphier, c’est saper le langage, le détourner, l’amadouer ? Qu’est-ce que cela me fait, nous fait, de danser, parler, énoncer, taire, se taire ? S’agit-il de performer des discours ? Ou, plus subtilement, de subvertir ce qui est danse et ce qui est prise de parole ? En quoi, en ces années 2020, la chorégraphe, danseuse et chercheuse que je suis est-elle concernée par ces performances surgies il y a un demi-siècle ? Quelles empreintes ? Quelles lancées ?',
            link: 'https://journals.openedition.org/danse/6768' // Ajoutez le lien du texte intégral ici
        },



        // Panel pour Audio 14, 15, 16, 17
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
          
        

        // Panel pour Audio 18, 19
        {
            title: 'Danser la disparition. Poursuivre l’élan des danses',
            authors: 'Marian del Valle, Antia Díaz Otero, Elisabeth Maesen et Barbara Manzetti',
            summaryTitle:'Résumé',
            summary: 'Le projet Danser la disparition (2021-2023) explore les multiples façons dont la danse disparait en se propageant sans cesse dans l’écriture, dans de nouvelles danses. Il poursuit la recherche d’une rencontre vivante entre danse et écriture. Il cherche à prolonger l’élan des danses, à mettre en lumière des aspects moins visibles de la création chorégraphique, et rend hommage aux artistes chorégraphes qui m’ont précédée, accompagnée et nourrie par leur travail. J’ai recueilli les paroles de cinq danseuses-chorégraphes qui évoquent les expériences vécues lors du processus de création et de représentation d’une pièce dansée dans le passé. Trois de ces entretiens sont repris ici, à leurs voix s’ajoute la mienne, ensemble elles forment une nouvelle matière, l’écriture.',
            link : 'https://journals.openedition.org/danse/6731'
        },
        {
            title: 'Danser la disparition. Poursuivre l’élan des danses',
            authors: 'Marian del Valle, Antia Díaz Otero, Elisabeth Maesen et Barbara Manzetti',
            summaryTitle:'Résumé',
            summary: 'Le projet Danser la disparition (2021-2023) explore les multiples façons dont la danse disparait en se propageant sans cesse dans l’écriture, dans de nouvelles danses. Il poursuit la recherche d’une rencontre vivante entre danse et écriture. Il cherche à prolonger l’élan des danses, à mettre en lumière des aspects moins visibles de la création chorégraphique, et rend hommage aux artistes chorégraphes qui m’ont précédée, accompagnée et nourrie par leur travail. J’ai recueilli les paroles de cinq danseuses-chorégraphes qui évoquent les expériences vécues lors du processus de création et de représentation d’une pièce dansée dans le passé. Trois de ces entretiens sont repris ici, à leurs voix s’ajoute la mienne, ensemble elles forment une nouvelle matière, l’écriture.',
            link : 'https://journals.openedition.org/danse/6731'
        },




        // Panel pour Audio 20, 21, 22, 23
        { 
            title: 'Manifeste de la Phonésie. Pour un «nouveau» art de rencontre entre danse et poésie',
            authors: 'Anatoli Vlassov',
            summaryTitle:'Résumé',
            summary: 'La Phonésie, « nouveau » art hybridant danse contemporaine et poésie sonore, se caractérise par la simultanéité des mouvements dansés et des paroles prononcées par les danseurs et danseuses parlant·e·s, modifiant la structure linguistique et la qualité du mouvement corporel. Elle se singularise par cette interaction agissante et mutuelle entre la danse et la parole. Cette technique performative cherche à créer des étrangetés dans les liens habituels entre le corps et la langue, déconstruisant les automatismes verbo-gestuels. Elle se définit comme un langage composite, utilisant des outils spécifiques comme les « Trois Pistes » (Danse, Voix, Mot), les « Motivateurs » pour lier gestes et paroles, la notion de corpArléité où la langue et la danse figurent comme des formes de vie (langagière et somatique) au même titre que celle de l’humain et la Sens-Ation pour générer de nouvelles associations entre corps et langue. Enfin, la Phonésie représente une performance de la conscience, invitant à une exploration de la métamorphose subjective à travers l’interaction entre rétentions (passé) et protentions (futur) logo-somatiques puis attention nucléaire, offrant ainsi une expérience sensorielle et intellectuelle unique.',
            link : 'https://journals.openedition.org/danse/6884'
        },
        { 
            title: 'Manifeste de la Phonésie. Pour un «nouveau» art de rencontre entre danse et poésie',
            authors: 'Anatoli Vlassov',
            summaryTitle:'Résumé',
            summary: 'La Phonésie, « nouveau » art hybridant danse contemporaine et poésie sonore, se caractérise par la simultanéité des mouvements dansés et des paroles prononcées par les danseurs et danseuses parlant·e·s, modifiant la structure linguistique et la qualité du mouvement corporel. Elle se singularise par cette interaction agissante et mutuelle entre la danse et la parole. Cette technique performative cherche à créer des étrangetés dans les liens habituels entre le corps et la langue, déconstruisant les automatismes verbo-gestuels. Elle se définit comme un langage composite, utilisant des outils spécifiques comme les « Trois Pistes » (Danse, Voix, Mot), les « Motivateurs » pour lier gestes et paroles, la notion de corpArléité où la langue et la danse figurent comme des formes de vie (langagière et somatique) au même titre que celle de l’humain et la Sens-Ation pour générer de nouvelles associations entre corps et langue. Enfin, la Phonésie représente une performance de la conscience, invitant à une exploration de la métamorphose subjective à travers l’interaction entre rétentions (passé) et protentions (futur) logo-somatiques puis attention nucléaire, offrant ainsi une expérience sensorielle et intellectuelle unique.',
            link : 'https://journals.openedition.org/danse/6884'
        },
        { 
            title: 'Manifeste de la Phonésie. Pour un «nouveau» art de rencontre entre danse et poésie',
            authors: 'Anatoli Vlassov',
            summaryTitle:'Résumé',
            summary: 'La Phonésie, « nouveau » art hybridant danse contemporaine et poésie sonore, se caractérise par la simultanéité des mouvements dansés et des paroles prononcées par les danseurs et danseuses parlant·e·s, modifiant la structure linguistique et la qualité du mouvement corporel. Elle se singularise par cette interaction agissante et mutuelle entre la danse et la parole. Cette technique performative cherche à créer des étrangetés dans les liens habituels entre le corps et la langue, déconstruisant les automatismes verbo-gestuels. Elle se définit comme un langage composite, utilisant des outils spécifiques comme les « Trois Pistes » (Danse, Voix, Mot), les « Motivateurs » pour lier gestes et paroles, la notion de corpArléité où la langue et la danse figurent comme des formes de vie (langagière et somatique) au même titre que celle de l’humain et la Sens-Ation pour générer de nouvelles associations entre corps et langue. Enfin, la Phonésie représente une performance de la conscience, invitant à une exploration de la métamorphose subjective à travers l’interaction entre rétentions (passé) et protentions (futur) logo-somatiques puis attention nucléaire, offrant ainsi une expérience sensorielle et intellectuelle unique.',
            link : 'https://journals.openedition.org/danse/6884'
        },
        { 
            title: 'Manifeste de la Phonésie. Pour un «nouveau» art de rencontre entre danse et poésie',
            authors: 'Anatoli Vlassov',
            summaryTitle:'Résumé',
            summary: 'La Phonésie, « nouveau » art hybridant danse contemporaine et poésie sonore, se caractérise par la simultanéité des mouvements dansés et des paroles prononcées par les danseurs et danseuses parlant·e·s, modifiant la structure linguistique et la qualité du mouvement corporel. Elle se singularise par cette interaction agissante et mutuelle entre la danse et la parole. Cette technique performative cherche à créer des étrangetés dans les liens habituels entre le corps et la langue, déconstruisant les automatismes verbo-gestuels. Elle se définit comme un langage composite, utilisant des outils spécifiques comme les « Trois Pistes » (Danse, Voix, Mot), les « Motivateurs » pour lier gestes et paroles, la notion de corpArléité où la langue et la danse figurent comme des formes de vie (langagière et somatique) au même titre que celle de l’humain et la Sens-Ation pour générer de nouvelles associations entre corps et langue. Enfin, la Phonésie représente une performance de la conscience, invitant à une exploration de la métamorphose subjective à travers l’interaction entre rétentions (passé) et protentions (futur) logo-somatiques puis attention nucléaire, offrant ainsi une expérience sensorielle et intellectuelle unique.',
            link : 'https://journals.openedition.org/danse/6884'
        },



        // Panel pour Audio 24
        {
            title: 'Un regard sur Le Sacre du printemps «d’après Nijinski» de Dominique Brun à travers la parole de Loup Marcault, danseur de l’Opéra de Paris',
            authors: 'Thais Meirelles Parelli',
            summaryTitle:'Résumé',
            summary: 'Le texte présente un entretien avec Loup Marcault, danseur du ballet de l’Opéra de Paris, que j’ai mené lors de mon accompagnement du processus de recréation du Sacre du printemps d’après Nijinski par Dominique Brun à l’Opéra entre octobre et décembre 2021. En amont, nous verrons comment j’ai pu, en tant que chercheuse, « donner la parole » à ce danseur, et surtout comment la chorégraphe elle-même a donné « place à la parole » des danseurs pendant les répétitions dans les studios du Palais Garnier, cela notamment autour des archives du Sacre du printemps. Au travers de ce témoignage, nous pourrons apprécier combien la « parole », le dialogue et l’échange ont eu un impact sur l’apprentissage des mouvements du ballet par les danseurs, sur la possibilité qu’ils inventent un « nouveau corps » et finalement sur la dimension de « recherche permanente » qui préside à ce processus de recréation, tel que l’ont investi Dominique Brun et son équipe.',
            link : 'https://journals.openedition.org/danse/6924'
        },



        // Panel pour Audio 25, 26, 27, 28
        {
            title: 'Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904',
            authors: 'Eléa Lauret-Baussay',
            summaryTitle:'Résumé',
            summary: 'Mettre en valeur la voix et le pouvoir d’action d’une danseuse italienne de la deuxième moitié du XIXe siècle, tel est l’objectif de cet article. En publiant ses mémoires en 1904, Venti anni di palcoscenico, Claudina Cucchi présente la voix directe et subjective d’une femme travailleuse, maîtresse de son art et de sa carrière. L’autrice amène le lecteur à suivre ses déplacements en Europe faisant de ceux-ci le fil conducteur de son récit : pourquoi et comment la notion de circulation se présente-t-elle comme un enjeu majeur à la réalisation de sa carrière ? En réponse à cette question, cet article aborde alors l’importance de l’enjeu financier de son métier, de la gestion et construction de sa célébrité tout en relevant la résonance politique de son discours autour de la question des revendications identitaires en Europe, propre au contexte historique de la deuxième moitié du XIXe siècle.',
            link : 'https://journals.openedition.org/danse/6724'
        },
        {
            title: 'Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904',
            authors: 'Eléa Lauret-Baussay',
            summaryTitle:'Résumé',
            summary: 'Mettre en valeur la voix et le pouvoir d’action d’une danseuse italienne de la deuxième moitié du XIXe siècle, tel est l’objectif de cet article. En publiant ses mémoires en 1904, Venti anni di palcoscenico, Claudina Cucchi présente la voix directe et subjective d’une femme travailleuse, maîtresse de son art et de sa carrière. L’autrice amène le lecteur à suivre ses déplacements en Europe faisant de ceux-ci le fil conducteur de son récit : pourquoi et comment la notion de circulation se présente-t-elle comme un enjeu majeur à la réalisation de sa carrière ? En réponse à cette question, cet article aborde alors l’importance de l’enjeu financier de son métier, de la gestion et construction de sa célébrité tout en relevant la résonance politique de son discours autour de la question des revendications identitaires en Europe, propre au contexte historique de la deuxième moitié du XIXe siècle.',
            link : 'https://journals.openedition.org/danse/6724'
        },
        {
            title: 'Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904',
            authors: 'Eléa Lauret-Baussay',
            summaryTitle:'Résumé',
            summary: 'Mettre en valeur la voix et le pouvoir d’action d’une danseuse italienne de la deuxième moitié du XIXe siècle, tel est l’objectif de cet article. En publiant ses mémoires en 1904, Venti anni di palcoscenico, Claudina Cucchi présente la voix directe et subjective d’une femme travailleuse, maîtresse de son art et de sa carrière. L’autrice amène le lecteur à suivre ses déplacements en Europe faisant de ceux-ci le fil conducteur de son récit : pourquoi et comment la notion de circulation se présente-t-elle comme un enjeu majeur à la réalisation de sa carrière ? En réponse à cette question, cet article aborde alors l’importance de l’enjeu financier de son métier, de la gestion et construction de sa célébrité tout en relevant la résonance politique de son discours autour de la question des revendications identitaires en Europe, propre au contexte historique de la deuxième moitié du XIXe siècle.',
            link : 'https://journals.openedition.org/danse/6724'
        },
        {
            title: 'Mémoires de la ballerine Claudina Cucchi : mise en récit des enjeux politico-économiques de la construction d’une carrière itinérante en Europe, 1838-1904',
            authors: 'Eléa Lauret-Baussay',
            summaryTitle:'Résumé',
            summary: 'Mettre en valeur la voix et le pouvoir d’action d’une danseuse italienne de la deuxième moitié du XIXe siècle, tel est l’objectif de cet article. En publiant ses mémoires en 1904, Venti anni di palcoscenico, Claudina Cucchi présente la voix directe et subjective d’une femme travailleuse, maîtresse de son art et de sa carrière. L’autrice amène le lecteur à suivre ses déplacements en Europe faisant de ceux-ci le fil conducteur de son récit : pourquoi et comment la notion de circulation se présente-t-elle comme un enjeu majeur à la réalisation de sa carrière ? En réponse à cette question, cet article aborde alors l’importance de l’enjeu financier de son métier, de la gestion et construction de sa célébrité tout en relevant la résonance politique de son discours autour de la question des revendications identitaires en Europe, propre au contexte historique de la deuxième moitié du XIXe siècle.',
            link : 'https://journals.openedition.org/danse/6724'
        },



         // Panel pour Audio 29, 30
        {
            title: 'Écouter les mouvements de la mémoire de l’autre',
            authors: 'Julia Wehren',
            summaryTitle:'Résumé',
            summary: 'Cet article propose une discussion sur l’histoire orale en danse. À l’aide d’exemples d’entretiens menés dans le cadre d’un projet de recherche sur l’histoire de la danse en Suisse, il examine des aspects centraux du processus d’entretien et de l’évaluation historiographique. L’accent est mis sur les aspects de l’interaction et de la participation. L’histoire orale est comprise comme un format autobiographique – dans le sens de l’écriture (graphie) de sa vie (bio) par soi-même (auto) – et en même temps collaboratif. Ce rapport de tension fait de l’histoire orale une méthode exigeante et prometteuse en même temps, qui peut contribuer à une historiographie polyphonique, participative et procédurale en danse.',
            link : 'https://journals.openedition.org/danse/6718'
        },
        {
            title: 'Écouter les mouvements de la mémoire de l’autre',
            authors: 'Julia Wehren',
            summaryTitle:'Résumé',
            summary: 'Cet article propose une discussion sur l’histoire orale en danse. À l’aide d’exemples d’entretiens menés dans le cadre d’un projet de recherche sur l’histoire de la danse en Suisse, il examine des aspects centraux du processus d’entretien et de l’évaluation historiographique. L’accent est mis sur les aspects de l’interaction et de la participation. L’histoire orale est comprise comme un format autobiographique – dans le sens de l’écriture (graphie) de sa vie (bio) par soi-même (auto) – et en même temps collaboratif. Ce rapport de tension fait de l’histoire orale une méthode exigeante et prometteuse en même temps, qui peut contribuer à une historiographie polyphonique, participative et procédurale en danse.',
            link : 'https://journals.openedition.org/danse/6718'
        },



        // Panel pour Audio 31, 32
        {
            title: 'Parler de danse classique. Les images sensorielles d’Éléonore Guérineau',
            authors: 'Maëlle Rousselot et Éléonore Guérineau',
            summaryTitle:'Résumé',
            summary: 'Cet article laisse la parole à Éléonore Guérineau, sujet au sein du ballet de l’Opéra de Paris, et interroge la place de la parole chez les danseurs et danseuses classiques au niveau de l’apprentissage et de la transmission de cette discipline ou d’un rôle. Le dialogue avec Éléonore Guérineau tend à dépasser le cliché du danseur et de la danseuse, notamment classique, comme simples exécutants, qui n’ont pas le droit à la parole et qui demeurent dans un statut d’infans. De même, sa manière d’enseigner, notamment avec ce qu’elle nomme « images sensorielles », démontre un véritable besoin de communication orale au sein même du cours entre la professeure et l’élève.',
            link : 'https://journals.openedition.org/danse/6734'
        },
        {
            title: 'Parler de danse classique. Les images sensorielles d’Éléonore Guérineau',
            authors: 'Maëlle Rousselot et Éléonore Guérineau',
            summaryTitle:'Résumé',
            summary: 'Cet article laisse la parole à Éléonore Guérineau, sujet au sein du ballet de l’Opéra de Paris, et interroge la place de la parole chez les danseurs et danseuses classiques au niveau de l’apprentissage et de la transmission de cette discipline ou d’un rôle. Le dialogue avec Éléonore Guérineau tend à dépasser le cliché du danseur et de la danseuse, notamment classique, comme simples exécutants, qui n’ont pas le droit à la parole et qui demeurent dans un statut d’infans. De même, sa manière d’enseigner, notamment avec ce qu’elle nomme « images sensorielles », démontre un véritable besoin de communication orale au sein même du cours entre la professeure et l’élève.',
            link : 'https://journals.openedition.org/danse/6734'
        },



        // Panel pour Audio 33, 34, 35, 36
        {
            title: 'Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise',
            authors: 'Fabienne Berger et Julia Wehren',
            summaryTitle:'Résumé',
            summary: 'L’entretien d’histoire orale donne la parole à la danseuse et chorégraphe Fabienne Berger, figure phare des débuts de la danse contemporaine en Suisse, toujours active aujourd’hui. Son parcours dans la danse a suivi un chemin fragmenté. Enfant, elle passe un séjour marquant en Australie, puis, adolescente, se lance dans le militantisme politique de gauche et féministe. Des expériences décisives la mènent aux États-Unis pour étudier la danse et les pratiques somatiques en autodidacte. De retour à Lausanne, elle se lance dans la création et fonde, en 1985, sa propre compagnie. L’entretien met l’accent sur l’autoréflexion de son parcours et de sa position en tant que chorégraphe sur une scène suisse encore en formation. Il fait partie d’une collection d’entretiens d’histoire orale réalisés à l’université de Berne lors d’un projet de recherche sur les sources autobiographiques. Pour la publication, l’entretien a été raccourci et rédigé par les autrices.',
            link : 'https://journals.openedition.org/danse/6721'
        },
        {
            title: 'Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise',
            authors: 'Fabienne Berger et Julia Wehren',
            summaryTitle:'Résumé',
            summary: 'L’entretien d’histoire orale donne la parole à la danseuse et chorégraphe Fabienne Berger, figure phare des débuts de la danse contemporaine en Suisse, toujours active aujourd’hui. Son parcours dans la danse a suivi un chemin fragmenté. Enfant, elle passe un séjour marquant en Australie, puis, adolescente, se lance dans le militantisme politique de gauche et féministe. Des expériences décisives la mènent aux États-Unis pour étudier la danse et les pratiques somatiques en autodidacte. De retour à Lausanne, elle se lance dans la création et fonde, en 1985, sa propre compagnie. L’entretien met l’accent sur l’autoréflexion de son parcours et de sa position en tant que chorégraphe sur une scène suisse encore en formation. Il fait partie d’une collection d’entretiens d’histoire orale réalisés à l’université de Berne lors d’un projet de recherche sur les sources autobiographiques. Pour la publication, l’entretien a été raccourci et rédigé par les autrices.',
            link : 'https://journals.openedition.org/danse/6721'
        },
        {
            title: 'Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise',
            authors: 'Fabienne Berger et Julia Wehren',
            summaryTitle:'Résumé',
            summary: 'L’entretien d’histoire orale donne la parole à la danseuse et chorégraphe Fabienne Berger, figure phare des débuts de la danse contemporaine en Suisse, toujours active aujourd’hui. Son parcours dans la danse a suivi un chemin fragmenté. Enfant, elle passe un séjour marquant en Australie, puis, adolescente, se lance dans le militantisme politique de gauche et féministe. Des expériences décisives la mènent aux États-Unis pour étudier la danse et les pratiques somatiques en autodidacte. De retour à Lausanne, elle se lance dans la création et fonde, en 1985, sa propre compagnie. L’entretien met l’accent sur l’autoréflexion de son parcours et de sa position en tant que chorégraphe sur une scène suisse encore en formation. Il fait partie d’une collection d’entretiens d’histoire orale réalisés à l’université de Berne lors d’un projet de recherche sur les sources autobiographiques. Pour la publication, l’entretien a été raccourci et rédigé par les autrices.',
            link : 'https://journals.openedition.org/danse/6721'
        },
        {
            title: 'Comment cette matière de vie devient autre chose. Un entretien d’histoire orale autour des débuts de la scène de danse lausannoise',
            authors: 'Fabienne Berger et Julia Wehren',
            summaryTitle:'Résumé',
            summary: 'L’entretien d’histoire orale donne la parole à la danseuse et chorégraphe Fabienne Berger, figure phare des débuts de la danse contemporaine en Suisse, toujours active aujourd’hui. Son parcours dans la danse a suivi un chemin fragmenté. Enfant, elle passe un séjour marquant en Australie, puis, adolescente, se lance dans le militantisme politique de gauche et féministe. Des expériences décisives la mènent aux États-Unis pour étudier la danse et les pratiques somatiques en autodidacte. De retour à Lausanne, elle se lance dans la création et fonde, en 1985, sa propre compagnie. L’entretien met l’accent sur l’autoréflexion de son parcours et de sa position en tant que chorégraphe sur une scène suisse encore en formation. Il fait partie d’une collection d’entretiens d’histoire orale réalisés à l’université de Berne lors d’un projet de recherche sur les sources autobiographiques. Pour la publication, l’entretien a été raccourci et rédigé par les autrices.',
            link : 'https://journals.openedition.org/danse/6721'
        },



        // Panel pour Audio 37, 38, 39, 40
        {
            title: 'Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano',
            authors: 'Alessandra Randazzo et David Zambrano',
            summaryTitle:'Résumé',
            summary: 'Qu’est-ce que la pratique de l’improvisation en tant qu’ensemble de formes en acte qui n’est plus exclusivement mis au service d’une chorégraphie, nous apprend sur la recherche des mouvements en danse et sur certains concepts philosophiques ? Il semble que la recherche en improvisation, telle que sa pratique s’est développée depuis les années 1950 et 1960 aux États-Unis, se combine avec l’exploration de soi et avec l’expérimentation en soi de mouvements corporels afin de parvenir à une expression spontanée du corps en un lieu et en un temps donnés. Sous la forme d’un entretien, nous tentons de questionner ce phénomène sous trois aspects principaux : les notions de création, de transmission et d’intersubjectivité, en alliant pratique et théorie.',
            link : 'https://journals.openedition.org/danse/6753'
        },
        {
            title: 'Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano',
            authors: 'Alessandra Randazzo et David Zambrano',
            summaryTitle:'Résumé',
            summary: 'Qu’est-ce que la pratique de l’improvisation en tant qu’ensemble de formes en acte qui n’est plus exclusivement mis au service d’une chorégraphie, nous apprend sur la recherche des mouvements en danse et sur certains concepts philosophiques ? Il semble que la recherche en improvisation, telle que sa pratique s’est développée depuis les années 1950 et 1960 aux États-Unis, se combine avec l’exploration de soi et avec l’expérimentation en soi de mouvements corporels afin de parvenir à une expression spontanée du corps en un lieu et en un temps donnés. Sous la forme d’un entretien, nous tentons de questionner ce phénomène sous trois aspects principaux : les notions de création, de transmission et d’intersubjectivité, en alliant pratique et théorie.',
            link : 'https://journals.openedition.org/danse/6753'
        },
        {
            title: 'Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano',
            authors: 'Alessandra Randazzo et David Zambrano',
            summaryTitle:'Résumé',
            summary: 'Qu’est-ce que la pratique de l’improvisation en tant qu’ensemble de formes en acte qui n’est plus exclusivement mis au service d’une chorégraphie, nous apprend sur la recherche des mouvements en danse et sur certains concepts philosophiques ? Il semble que la recherche en improvisation, telle que sa pratique s’est développée depuis les années 1950 et 1960 aux États-Unis, se combine avec l’exploration de soi et avec l’expérimentation en soi de mouvements corporels afin de parvenir à une expression spontanée du corps en un lieu et en un temps donnés. Sous la forme d’un entretien, nous tentons de questionner ce phénomène sous trois aspects principaux : les notions de création, de transmission et d’intersubjectivité, en alliant pratique et théorie.',
            link : 'https://journals.openedition.org/danse/6753'
        },
        {
            title: 'Dialogue autour de l’improvisation : pratiques et théorie d’une nouvelle forme d’intersubjectivité. Entretien avec David Zambrano',
            authors: 'Alessandra Randazzo et David Zambrano',
            summaryTitle:'Résumé',
            summary: 'Qu’est-ce que la pratique de l’improvisation en tant qu’ensemble de formes en acte qui n’est plus exclusivement mis au service d’une chorégraphie, nous apprend sur la recherche des mouvements en danse et sur certains concepts philosophiques ? Il semble que la recherche en improvisation, telle que sa pratique s’est développée depuis les années 1950 et 1960 aux États-Unis, se combine avec l’exploration de soi et avec l’expérimentation en soi de mouvements corporels afin de parvenir à une expression spontanée du corps en un lieu et en un temps donnés. Sous la forme d’un entretien, nous tentons de questionner ce phénomène sous trois aspects principaux : les notions de création, de transmission et d’intersubjectivité, en alliant pratique et théorie.',
            link : 'https://journals.openedition.org/danse/6753'
        },



        // Panel pour Audio 41, 42, 43
        {
            title: 'L’entretien sur commande : les enjeux de la parole chez Karine Saporta',
            authors: 'Pauline Boivineau et Claire Rousier',
            summaryTitle:'Résumé',
            summary: 'Figure majeure de la danse d’auteurs à partir des années 1980 en France, Karine Saporta, qui dirigea durant seize ans le Centre chorégraphique national de Caen, est une figure paradoxalement en retrait de l’histoire de la danse aujourd’hui. Mue par le désir de faire entendre sa voix/voie, elle initie en 2022 une série d’entretiens dans la perspective d’une publication qui permettrait de rendre accessible et audible sa parole tant sur ses œuvres, son parcours d’artiste, ses engagements pour la danse que sur ses réflexions et questionnements au sujet du champ chorégraphique. Cet article se propose d’analyser la mise en œuvre de ces entretiens et les questions méthodologiques qu’ils ont soulevées au regard du projet éditorial. Il cherche également à mettre en exergue la fonction du récit chez la chorégraphe. Nous verrons comment les entretiens bousculent le « mythe Saporta » pour réintroduire l’histoire et questionner l’« être féministe » de l’artiste.',
            link : 'https://journals.openedition.org/danse/6751'
        },
        {
            title: 'L’entretien sur commande : les enjeux de la parole chez Karine Saporta',
            authors: 'Pauline Boivineau et Claire Rousier',
            summaryTitle:'Résumé',
            summary: 'Figure majeure de la danse d’auteurs à partir des années 1980 en France, Karine Saporta, qui dirigea durant seize ans le Centre chorégraphique national de Caen, est une figure paradoxalement en retrait de l’histoire de la danse aujourd’hui. Mue par le désir de faire entendre sa voix/voie, elle initie en 2022 une série d’entretiens dans la perspective d’une publication qui permettrait de rendre accessible et audible sa parole tant sur ses œuvres, son parcours d’artiste, ses engagements pour la danse que sur ses réflexions et questionnements au sujet du champ chorégraphique. Cet article se propose d’analyser la mise en œuvre de ces entretiens et les questions méthodologiques qu’ils ont soulevées au regard du projet éditorial. Il cherche également à mettre en exergue la fonction du récit chez la chorégraphe. Nous verrons comment les entretiens bousculent le « mythe Saporta » pour réintroduire l’histoire et questionner l’« être féministe » de l’artiste.',
            link : 'https://journals.openedition.org/danse/6751'
        },
        {
            title: 'L’entretien sur commande : les enjeux de la parole chez Karine Saporta',
            authors: 'Pauline Boivineau et Claire Rousier',
            summaryTitle:'Résumé',
            summary: 'Figure majeure de la danse d’auteurs à partir des années 1980 en France, Karine Saporta, qui dirigea durant seize ans le Centre chorégraphique national de Caen, est une figure paradoxalement en retrait de l’histoire de la danse aujourd’hui. Mue par le désir de faire entendre sa voix/voie, elle initie en 2022 une série d’entretiens dans la perspective d’une publication qui permettrait de rendre accessible et audible sa parole tant sur ses œuvres, son parcours d’artiste, ses engagements pour la danse que sur ses réflexions et questionnements au sujet du champ chorégraphique. Cet article se propose d’analyser la mise en œuvre de ces entretiens et les questions méthodologiques qu’ils ont soulevées au regard du projet éditorial. Il cherche également à mettre en exergue la fonction du récit chez la chorégraphe. Nous verrons comment les entretiens bousculent le « mythe Saporta » pour réintroduire l’histoire et questionner l’« être féministe » de l’artiste.',
            link : 'https://journals.openedition.org/danse/6751'
        },



        // Panel pour Audio 44, 45, 46, 47
        {
            title: 'Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions',
            authors: 'Camille Casale',
            summaryTitle:'Résumé',
            summary: 'Cet article vise à éclairer les rapports au métier que développent les jeunes danseurs et les jeunes danseuses, à travers la thématique de la santé. L’étude se centre sur la construction de la santé intériorisée par des élèves en fin de formation dans des écoles à visée professionnelle. La parole révèle une transformation partielle des croyances concernant le dépassement de soi et de la douleur ainsi que l’apparition d’une logique d’optimisation dans les habitudes de vie. De plus, elle manifeste un besoin de modifications des conditions structurelles du métier, tout en indiquant l’intériorisation et l’acceptation de celles-ci. Elle met également au jour un invisible en studio et sur scène, celui des douleurs, du désarroi émotionnel et psychologique.',
            link : 'https://journals.openedition.org/danse/6741'
        },
        {
            title: 'Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions',
            authors: 'Camille Casale',
            summaryTitle:'Résumé',
            summary: 'Cet article vise à éclairer les rapports au métier que développent les jeunes danseurs et les jeunes danseuses, à travers la thématique de la santé. L’étude se centre sur la construction de la santé intériorisée par des élèves en fin de formation dans des écoles à visée professionnelle. La parole révèle une transformation partielle des croyances concernant le dépassement de soi et de la douleur ainsi que l’apparition d’une logique d’optimisation dans les habitudes de vie. De plus, elle manifeste un besoin de modifications des conditions structurelles du métier, tout en indiquant l’intériorisation et l’acceptation de celles-ci. Elle met également au jour un invisible en studio et sur scène, celui des douleurs, du désarroi émotionnel et psychologique.',
            link : 'https://journals.openedition.org/danse/6741'
        },
        {
            title: 'Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions',
            authors: 'Camille Casale',
            summaryTitle:'Résumé',
            summary: 'Cet article vise à éclairer les rapports au métier que développent les jeunes danseurs et les jeunes danseuses, à travers la thématique de la santé. L’étude se centre sur la construction de la santé intériorisée par des élèves en fin de formation dans des écoles à visée professionnelle. La parole révèle une transformation partielle des croyances concernant le dépassement de soi et de la douleur ainsi que l’apparition d’une logique d’optimisation dans les habitudes de vie. De plus, elle manifeste un besoin de modifications des conditions structurelles du métier, tout en indiquant l’intériorisation et l’acceptation de celles-ci. Elle met également au jour un invisible en studio et sur scène, celui des douleurs, du désarroi émotionnel et psychologique.',
            link : 'https://journals.openedition.org/danse/6741'
        },
        {
            title: 'Quand la parole révèle les conditions de santé du métier de danseur et de danseuse. Normes, douleurs et évolutions',
            authors: 'Camille Casale',
            summaryTitle:'Résumé',
            summary: 'Cet article vise à éclairer les rapports au métier que développent les jeunes danseurs et les jeunes danseuses, à travers la thématique de la santé. L’étude se centre sur la construction de la santé intériorisée par des élèves en fin de formation dans des écoles à visée professionnelle. La parole révèle une transformation partielle des croyances concernant le dépassement de soi et de la douleur ainsi que l’apparition d’une logique d’optimisation dans les habitudes de vie. De plus, elle manifeste un besoin de modifications des conditions structurelles du métier, tout en indiquant l’intériorisation et l’acceptation de celles-ci. Elle met également au jour un invisible en studio et sur scène, celui des douleurs, du désarroi émotionnel et psychologique.',
            link : 'https://journals.openedition.org/danse/6741'
        },



        // Panel pour Audio 48, 49, 50, 51
        {
            title: 'Gestes de parole',
            authors: 'Mathieu Bouvier',
            summaryTitle:'Résumé',
            summary: 'Lorsqu’il s’agit de susciter l’invention d’un geste inédit, il n’est pas question, pour les chorégraphes ou les pédagogues, de prescrire ou de demander ce geste, mais de l’appeler, au moyen d’une parole capable de favoriser le débrayage des habitudes et l’émulation d’un imaginaire radical dans la fabrique du geste. À l’appui d’exemples empruntés à des pédagogues et à des artistes chorégraphiques, cet article analyse certains moyens heuristiques dont dispose la parole guidante : débrayages actantiels, métaphores, paradoxes sont quelques-uns de ces « gestes de paroles » qui peuvent susciter une image de sensation dans la corporéité, et lui donner figure dans une danse.',
            link : 'https://journals.openedition.org/danse/6736'
        },
        {
            title: 'Gestes de parole',
            authors: 'Mathieu Bouvier',
            summaryTitle:'Résumé',
            summary: 'Lorsqu’il s’agit de susciter l’invention d’un geste inédit, il n’est pas question, pour les chorégraphes ou les pédagogues, de prescrire ou de demander ce geste, mais de l’appeler, au moyen d’une parole capable de favoriser le débrayage des habitudes et l’émulation d’un imaginaire radical dans la fabrique du geste. À l’appui d’exemples empruntés à des pédagogues et à des artistes chorégraphiques, cet article analyse certains moyens heuristiques dont dispose la parole guidante : débrayages actantiels, métaphores, paradoxes sont quelques-uns de ces « gestes de paroles » qui peuvent susciter une image de sensation dans la corporéité, et lui donner figure dans une danse.',
            link : 'https://journals.openedition.org/danse/6736'
        },
        {
            title: 'Gestes de parole',
            authors: 'Mathieu Bouvier',
            summaryTitle:'Résumé',
            summary: 'Lorsqu’il s’agit de susciter l’invention d’un geste inédit, il n’est pas question, pour les chorégraphes ou les pédagogues, de prescrire ou de demander ce geste, mais de l’appeler, au moyen d’une parole capable de favoriser le débrayage des habitudes et l’émulation d’un imaginaire radical dans la fabrique du geste. À l’appui d’exemples empruntés à des pédagogues et à des artistes chorégraphiques, cet article analyse certains moyens heuristiques dont dispose la parole guidante : débrayages actantiels, métaphores, paradoxes sont quelques-uns de ces « gestes de paroles » qui peuvent susciter une image de sensation dans la corporéité, et lui donner figure dans une danse.',
            link : 'https://journals.openedition.org/danse/6736'
        },
        {
            title: 'Gestes de parole',
            authors: 'Mathieu Bouvier',
            summaryTitle:'Résumé',
            summary: 'Lorsqu’il s’agit de susciter l’invention d’un geste inédit, il n’est pas question, pour les chorégraphes ou les pédagogues, de prescrire ou de demander ce geste, mais de l’appeler, au moyen d’une parole capable de favoriser le débrayage des habitudes et l’émulation d’un imaginaire radical dans la fabrique du geste. À l’appui d’exemples empruntés à des pédagogues et à des artistes chorégraphiques, cet article analyse certains moyens heuristiques dont dispose la parole guidante : débrayages actantiels, métaphores, paradoxes sont quelques-uns de ces « gestes de paroles » qui peuvent susciter une image de sensation dans la corporéité, et lui donner figure dans une danse.',
            link : 'https://journals.openedition.org/danse/6736'
        },

        // Ajoutez les titres, les auteurs, les résumés et les liens pour chaque audio
    ];

    // Fonction pour afficher le texte Parole de: et le lien "En lire plus"
    function showParoleText(triangleIndex) {
        const generalTexts = [
            "PLAIRE AUX VACHES<br>Paroles d'Anna Chirescu<br>—<br>Lecture du texte éponyme de Michel Ots<br>Paris, 10 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",           
            "BOUCHE DE VACHE<br>Paroles d'Anna Chirescu<br>—<br>Extrait de la création « VACA » 2022, composition Yoan Chirescu<br>Paris, 10 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "CLOCHES<br>Paroles d'Anna Chirescu<br>—<br>Extrait de la création « VACA » 2022, composition Yoan Chirescu<br>Paris, 10 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "BEACH SOUNDS<br>Paroles de Caroline Granger<br>—<br>Récolte de sons à la plage<br>Le Croisic, 28 déc. 2023<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "INTRODUCTION<br>Paroles de Caroline Granger<br>—<br>Lecture d'un extrait de l'article<br>Le Croisic, 4 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "MOSAÏQUE DES MÉMOIRES<br>Paroles de Mariko Kitahara<br>—<br>Lecture d'un extrait de l'article<br>Thionville<br>22 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LE VISAGE DU MAÎTRE<br>Paroles de Brigitte Chataignier, Federica Fratagnoli<br>—<br>Extrait d’entretien avec Brigitte Chataignier<br>Nice, 1 juil. 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LES YEUX QUI PLISSENT<br>Paroles de Brigitte Chataignier, Federica Fratagnoli<br>—<br>Extrait d’entretien avec Brigitte Chataignier<br>Nice, 1 juil. 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "FORMATION EN ABHINAYA<br>Paroles de Federica Fratagnoli<br>—<br>Lecture d’un extrait de l'article (sur la musique du padam « Ilatalir shayané »)<br>Siena, Italie, 1 janv. 2024<br>—</p>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "À L’ORIGINE DU TEXTE « TROUBLES »<br>Paroles de Geisha Fontaine<br>—<br>Texte inédit<br>Paris, 20 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "À LA DEBORAH HAY<br>Paroles de Geisha Fontaine<br>—<br>Improvisation orale<br>Paris, 31 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LA MEUTE<br>Paroles de Geisha Fontaine<br>—<br>Extrait de la performance<br>« Ne faites pas la moue #3 »<br>Le 6b, Saint-Denis, 1 avr. 2023<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LA DANSE DES Z / MILLE RONDES<br>Paroles de Geisha Fontaine<br>—<br>Extrait de Geisha Fontaine, « Les 100 Mots de la danse », PUF, 2018, p.118<br>Paris, 21 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "JE NE POURRAIS PAS DANSER #1<br>Paroles de Lulla Chourlin<br>—<br>Extrait du spectacle « Conférence sensible » (2018)<br>Besançon, 2018<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "JE NE POURRAIS PAS DANSER #2<br>Paroles de Lulla Chourlin<br>—<br>Extrait du spectacle « Conférence sensible » (2018)<br>Besançon, 2018<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LES ANCÊTRES #1<br>Paroles de Lulla Chourlin<br>—<br>Extrait du spectacle « Conférence sensible » (2018)<br>Besançon, 2018<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LES ANCÊTRES #2<br>Paroles de Lulla Chourlin<br>—<br>Extrait du spectacle « Conférence sensible » (2018)<br>Besançon, 2018<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "J'ÉTAIS LE CHEVAL<br>Paroles de Barbara Manzetti<br>—<br>Extrait d’entretien mené par Marian Del Valle<br>Lille, 10 juil. 2021<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "INTRODUCTION<br>Paroles de Marian del Valle<br>—<br>Lecture d'un extrait de l'article<br>Bruxelles, 5 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "PHONÉSIE 1 « CHAIRS LIVRES »<br>Paroles d'Anatoli Vlassov<br>—<br>Performance interactive à la Bibliothèque Jacques Prévert<br>Cherbourg, 20 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "PHONÉSIE 2 « CHAIRS LIVRES »<br>Paroles d'Anatoli Vlassov<br>—<br>Performance interactive à la Bibliothèque Jacques Prévert<br>Cherbourg, 20 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "PHONÉSIE 3 « CHAIRS LIVRES »<br>Paroles d'Anatoli Vlassov<br>—<br>Performance interactive à la Bibliothèque Jacques Prévert<br>Cherbourg, 20 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "PHONÉSIE 4 « CHAIRS LIVRES »<br>Paroles d'Anatoli Vlassov<br>—<br>Performance interactive à la Bibliothèque Jacques Prévert<br>Cherbourg, 20 janv. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LE CORPS DU SACRE<br>Paroles de Thais Meirelles Parelli<br>—<br>Lecture d'un extrait de l'entretien avec Loup Marcault<br>Paris, 14 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LES DÉBUTS<br>Paroles de Sara Aggazio<br>—<br>Lecture d'un extrait des « Mémoires » de Claudina Cucchi, « Venti anni di palcoscenico : ricordi artistici », Roma, Enrico Voghera, 1904, pp. 4-5.<br>Paris, 11 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LA DIVA DELLA DANZA<br>Paroles de Sara Aggazio<br>—<br>Lecture d'un extrait des « Mémoires » de Claudina Cucchi, « Venti anni di palcoscenico : ricordi artistici », Roma, Enrico Voghera, 1904, pp. 61-62<br>Paris, 11 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LES SALONS DE VIENNE<br>Paroles de Sara Aggazio<br>—<br>Lecture d'un extrait des « Mémoires » de Claudina Cucchi, « Venti anni di palcoscenico : ricordi artistici », Roma, Enrico Voghera, 1904, p. 85.<br>Paris, 11 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "AUTOUR DE BRAHMA<br>Paroles de Sara Aggazio (lecture)<br>Hugo Delor (piano)<br>—<br>Lecture d'un extrait des « Mémoires » de Claudina Cucchi, « Venti anni di palcoscenico : ricordi artistici », Roma, Enrico Voghera, 1904, pp. 181-182. Extrait au piano du « Passo della Farfalla » interprété à partir du recueil de partitions Brahma, ballo in un Prologo e sei Atti del coreografo Ippolito Monplaisir. Musica di C. Dall'Argine. Riduzione per pianoforte solo di F. Almasio », D1 MUS B 330 022, Fondo d'Amico, Biblioteca e Archivio musicale dell'Accademia nazionale di S. Cecilia.<br>Paris, 11 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "PASSER PAR LE VISUEL<br>Paroles de Marie-Jane Otth<br>—<br>Extrait d'un entretien mené par Julia Wehren<br>Lausanne, 28 juin 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LE SENS DU BEAU<br>Paroles de Marie-Jane Otth<br>—<br>Extrait d'un entretien mené par Julia Wehren<br>Lausanne, 28 juin 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "INTRODUCTION<br>Paroles de Maëlle Rousselot<br>—<br>Lecture d'un extrait de l'article<br>Besançon, 16 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "L'IMAGE SENSORIELLE SELON ÉLÉONORE GUÉRINEAU<br>Paroles de Maëlle Rousselot<br>—<br>Lecture d'un extrait de l'entretien avec Éléonore Guérineau<br>Besançon, 16 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "DE L’ORDINAIRE VERS L'EXTRAORDINAIRE<br>Paroles de Fabienne Berger<br>—<br>Extrait de l'entretien mené par Julia Wehren<br>Promasens, 10 sept. 2020<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LE SINGULIER SE CONSTRUIT DANS ET AVEC LE PLURIEL<br>Paroles de Fabienne Berger<br>—<br>Extrait de l'entretien mené par Julia Wehren<br>Promasens, 10 sept. 2020<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "ÊTRE EN PRÉSENCE<br>Paroles de Fabienne Berger<br>—<br>Extrait de l'entretien mené par Julia Wehren<br>Promasens, 10 sept. 2020<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "ALLER VERS LES AUTRES<br>Paroles de Fabienne Berger<br>—<br>Extrait de l'entretien mené par Julia Wehren<br>Promasens, 10 sept. 2020<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "A METHOD<br>Paroles de David Zambrano<br>—<br>Extrait de l'entretien mené par Alessandra Randazzo<br>Tictac Art Centre, Bruxelles, 11 mai 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "ANYONE<br>Paroles de David Zambrano<br>—<br>Extrait de l'entretien mené par Alessandra Randazzo<br>Tictac Art Centre, Bruxelles, 11 mai 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "ALL THE OTHER THINGS I THINK I’M NOT<br>Paroles de David Zambrano<br>—<br>Extrait de l'entretien mené par Alessandra Randazzo<br>Tictac Art Centre, Bruxelles, 11 mai 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "CONCLUSION<br>Paroles de Alessandra Randazzo<br>—<br>Lecture d’un extrait de l'article<br>Nice, 7 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "ORGANICITÉ ?<br>Paroles de Karine Saporta<br>—<br>Extrait d'entretien mené par Pauline Boivineau et Claire Rousier<br>Ouistreham, 1 mai 2022<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "ESPACE<br>Paroles de Karine Saporta<br>—<br>Lecture d’un extrait de l'article<br>Nice, 7 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "ALWIN NIKOLAIS - JOAN WOODBURY<br>Paroles de Karine Saporta<br>—<br>Lecture d’un extrait de l'article<br>Nice, 7 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "LA SANTÉ OPTIMISÉE<br>Paroles de Camille Casale<br>—<br>Lecture d’un extrait de l'article<br>Paris, 12 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "À L'ENCONTRE D'UN DISCOURS DE SANTÉ<br>Paroles de Camille Casale<br>—<br>Lecture d’un extrait de l'article<br>Paris, 12 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "EST-CE QUE VOUS AVEZ ÉTÉ BLESSÉ ?<br>Paroles de Camille Casale<br>—<br>Lecture d’un extrait de l'article<br>Paris, 12 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "PAROLES DE JULES THOMAS<br>Fragments de paroles de trois danseurs<br>—<br>Lecture d'extraits d'entretiens menés par Camille Casale<br>Nîmes, 12 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "DEVENIR-AUTRE #1<br>Paroles de Mathieu Bouvier<br>—<br>Lecture d’un extrait de l'article<br>Paris, 8 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "DEVENIR-AUTRE #2<br>Paroles de Mathieu Bouvier<br>—<br>Lecture d’un extrait de l'article<br>Paris, 8 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "DEVENIR-AUTRE #3<br>Paroles de Mathieu Bouvier<br>—<br>Lecture d’un extrait de l'article<br>Paris, 8 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",
            "DEVENIR-AUTRE #4<br>Paroles de Mathieu Bouvier<br>—<br>Lecture d’un extrait de l'article<br>Paris, 8 févr. 2024<br>—<br>ARTICLE référent : <br><b><a href=\"#\">Lire plus</a></b>",


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

        document.getElementById('video').style.marginLeft = '0';
    document.querySelectorAll('.flexbox').forEach(flexbox => {
    flexbox.style.marginRight = '0';
    });

        document.querySelector('.controls-container').classList.add('slide-timeline');
        video.classList.add('blur');

        setTimeout(() => {
            overlay.classList.remove('slide-out');
            overlay.classList.remove('hidden');
             overlayCredits.classList.add('hidden');
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
        overlay.classList.add('slide-out');
        document.querySelector('.controls-container').classList.remove('slide-timeline');
        video.classList.remove('blur');

        document.getElementById('video').style.marginLeft = '0%';
    document.querySelectorAll('.flexbox').forEach(flexbox => {
        flexbox.style.marginRight = '0%';
    });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const creditText = document.querySelector('.credit');
    const closeButtonCredits = document.getElementById('closeButtonCredits');
    const overlay1 = document.getElementById('overlay');
    const overlayCredits = document.getElementById('overlayCredits');
    const triangles = document.querySelectorAll('.triangle');
    const mainTitle = document.querySelector('.main-title');
    const subTitle = document.querySelector('.sub-title');
    const credit = document.querySelector('.credit');
    const paroleTextContainer = document.querySelector('.parole-text-container');
    const controlsContainer = document.querySelector('.controls-container');
    const audios = document.querySelectorAll('audio');
    const clickBlocker = document.getElementById('clickBlocker');

    creditText.addEventListener('click', function() {
        overlay1.classList.remove('slide-in');
        overlay1.classList.add('slide-out');
        overlay1.classList.add('hidden');
        overlayCredits.classList.remove('hidden');
        overlayCredits.classList.remove('slide-out-credits');
        overlayCredits.classList.add('slide-in-credits');
        mainTitle.classList.remove('no-blur');
        mainTitle.classList.add('blur');
        subTitle.classList.remove('no-blur');
        subTitle.classList.add('blur');
        paroleTextContainer.classList.add('hidden');
        paroleTextContainer.classList.remove('no-blur');
        paroleTextContainer.classList.add('blur');
        credit.classList.remove('no-blur');
        credit.classList.add('blur');
        video.classList.remove('no-blur');
        video.classList.add('blur');
        controlsContainer.classList.add('hidden');
        controlsContainer.classList.remove('no-blur')
        controlsContainer.classList.add('blur');
        clickBlocker.style.display = 'block'; // Montrer la couche transparente
        audios.forEach(audio => {
            audio.pause();
        });
        triangles.forEach(triangle => {
            triangle.classList.remove('no-blur');
            triangle.classList.add('blur');
            triangle.classList.add('disabled');
        });
        moveElementsLeft();

    });

    closeButtonCredits.addEventListener('click', function() {
        overlayCredits.classList.remove('slide-in-credits');
        overlayCredits.classList.add('slide-out-credits');
        overlay1.classList.remove('slide-in');
        overlay1.classList.remove('slide-out');
        overlay1.classList.add('hidden');
        setTimeout(() => {
            overlayCredits.classList.add('hidden');
            clickBlocker.style.display = 'none'; // Cacher la couche transparente
        }, 500); 
        paroleTextContainer.classList.remove('blur');
        paroleTextContainer.classList.add('no-blur');
        controlsContainer.classList.remove('blur');
        controlsContainer.classList.add('no-blur');
        mainTitle.classList.remove('blur');
        mainTitle.classList.add('no-blur');
        subTitle.classList.remove('blur');
        subTitle.classList.add('no-blur');
        credit.classList.remove('blur');
        credit.classList.add('no-blur');
        video.classList.remove('blur');
        video.classList.add('no-blur');
        triangles.forEach(triangle => {
            triangle.classList.remove('blur');
            triangle.classList.add('no-blur');
            triangle.classList.remove('disabled');
            triangle.classList.remove('active');
        });
        resetElementMargins();
        removeBlur();
    });

       // Panneaux crédits : déplacement des éléments sur la droite à l'ouverture du panneau
    function moveElementsLeft() {
    mainTitle.style.marginLeft = '360px';
    subTitle.style.marginLeft = '360px';
    credit.style.marginLeft = '360px';
    controlsContainer.style.marginLeft = '360px'; 
    paroleTextContainer.style.marginLeft = '430px';
    // Ajoutez d'autres éléments si nécessaire
}
// Panneaux crédits : rétabblissement de la position des éléments sur la droite à l'ouverture du panneau
function resetElementMargins() {
    mainTitle.style.marginLeft = '0';
    subTitle.style.marginLeft = '0';
    credit.style.marginLeft = '0';
    video.style.marginLeft = '0';
    controlsContainer.style.marginLeft = '0';
    paroleTextContainer.style.marginLeft = '70px';
    // Réinitialisez d'autres éléments si nécessaire
};

function enableFlexboxHover() {
        document.querySelectorAll('.flexbox').forEach(flexbox => {
            flexbox.addEventListener('mouseover', addBlur);
            flexbox.addEventListener('mouseout', removeBlur);
        });
    };


    function addBlur(event) {
        document.querySelectorAll('.flexbox').forEach(otherFlexbox => {
            if (otherFlexbox !== event.currentTarget) {
                otherFlexbox.style.filter = 'blur(5px)';
                otherFlexbox.querySelectorAll('.triangle').forEach(triangle => {
                    triangle.classList.add('disabled');
                });
            }
        });
    }

    function removeBlur() {
        document.querySelectorAll('.flexbox').forEach(flexbox => {
            flexbox.style.filter = 'none';
            flexbox.querySelectorAll('.triangle').forEach(triangle => {
                triangle.classList.remove('disabled');
            });
        });
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



/* nom en hover des flexboxes */

const texts = {
      flexbox1: "<i>Des battements d’ailes<br>aux ruminations d’une vache.<br>Un entretien sur nos relations <br>au vivant avec Anna Chirescu.</i>",
      flexbox2: "<i>Revendication, récupération,<br> correction...<br>Lorsqu’un chorégraphe décide <br>d’écrire sa propre histoire :<br> le cas de l’autobiographie de <br>Mikhaïl Fokine.</i>",
      flexbox3: "<i>Pour un usage de <br>l’entretien d’explicitation <br>ou micro-phénoménologique <br>avec une interprète de Mohini Attam.<br>Retour sur une recherche en cours.</i>",
      flexbox4: "<i>Troubles.<br> Dans le sillage de trois performances <br>de Trisha Brown et de Deborah Hay.</i>",
      flexbox5: "<i>En résonance d’une<br>conférence sensible.</i>",
      flexbox6: "<i>Danser la disparition.<br>Poursuivre l’élan des danses.</i>",
      flexbox7: "<i>Manifeste de la Phonésie.<br>Pour un «nouveau» art<br>de rencontre<br>entre danse et poésie.</i>",
      flexbox8: "<i>Un regard sur Le Sacre du printemps<br>«d’après Nijinski» de Dominique Brun<br> à travers la parole de Loup Marcault,<br> danseur de l’Opéra de Paris.</i>",
      flexbox9: "<i>Mémoires de la ballerine<br>Claudina Cucchi :<br>mise en récit des enjeux<br>politico-économiques<br>de la construction<br>d’une carrière itinérante<br>en Europe, 1838-1904.</i>",
      flexbox10: "<i>Écouter les mouvements<br>de la mémoire de l’autre.</i>",
      flexbox11: "<i>Parler de danse classique.<br>Les images sensorielles<br>d’Éléonore Guérineau.</i>",
      flexbox12: "<i>Comment cette matière de vie<br>devient «autre chose».<br>Un entretien d’histoire orale<br>autour des débuts de<br>la scène de danse lausannoise.</i>",
      flexbox13: "<i>Dialogue autour de l’improvisation :<br>pratiques et théorie<br>d’une nouvelle forme d’intersubjectivité.<br>Entretien avec David Zambrano.</i>",
      flexbox14: "<i>L’entretien sur commande :<br>les enjeux de la parole<br>chez Karine Saporta</i>",
      flexbox15: "<i>Quand la parole révèle<br>les conditions de santé<br>du métier de danseur et de danseuse.<br>Normes, douleurs et évolutions.</i>",
      flexbox16: "<i>Gestes de parole.</i>",
      // Ajoutez des textes supplémentaires si nécessaire
    };

    const numFlexbox = 17; // Changez ce nombre selon le nombre de flexboxes
    const paragraphs = [];

    // Créer et ajouter les paragraphes au DOM
    for (let i = 0; i < numFlexbox; i++) {
      const flexboxIndex = `flexbox${i + 1}`;
      const paragraph = document.createElement('p');
      paragraph.className = `paragraph-${i + 1} hidden`; // Ajouter la classe hidden par défaut
      paragraph.innerHTML = texts[flexboxIndex]; 
      paragraphs.push(paragraph);
      document.body.appendChild(paragraph); 
    }

    // Ajouter des écouteurs d'événements pour les flexboxes
    const flexboxes = document.querySelectorAll('.flexbox');
flexboxes.forEach((flexbox, index) => {
  flexbox.addEventListener('mouseover', () => {
    console.log(`Mouseover flexbox ${index + 1}`);
    const paragraph = document.querySelector(`.paragraph-${index + 1}`);
    console.log(`Found paragraph: ${paragraph}`);
    if (paragraph) {
      paragraph.classList.remove('hidden');
      console.log(`Removed hidden class from paragraph`);
    }
  });

  flexbox.addEventListener('mouseout', () => {
    console.log(`Mouseout flexbox ${index + 1}`);
    const paragraph = document.querySelector(`.paragraph-${index + 1}`);
    console.log(`Found paragraph: ${paragraph}`);
    if (paragraph) {
      paragraph.classList.add('hidden');
      console.log(`Added hidden class to paragraph`);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const closeWelcomePopupButton = document.getElementById('closeWelcomePopup');
  const triangles = document.querySelectorAll('.triangle');
    const mainTitle = document.querySelector('.main-title');
    const subTitle = document.querySelector('.sub-title');
    const credit = document.querySelector('.credit');

  // Afficher le pop-up au chargement de la page
  welcomeOverlay.style.display = 'flex';
  mainTitle.classList.remove('no-blur');
        mainTitle.classList.add('blur');
        subTitle.classList.remove('no-blur');
        subTitle.classList.add('blur');
        credit.classList.remove('no-blur');
        credit.classList.add('blur');
        video.classList.remove('no-blur');
        video.classList.add('blur');
     triangles.forEach(triangle => {
            triangle.classList.remove('no-blur');
            triangle.classList.add('blur');
            triangle.classList.add('disabled');   

  // Fermer le pop-up lorsqu'on clique sur le bouton
  closeWelcomePopupButton.addEventListener('click', () => {
    welcomeOverlay.style.display = 'none';
    mainTitle.classList.remove('blur');
        mainTitle.classList.add('no-blur');
        subTitle.classList.remove('blur');
        subTitle.classList.add('no-blur');
        credit.classList.remove('blur');
        credit.classList.add('no-blur');
        video.classList.remove('blur');
        video.classList.add('no-blur');
        triangles.forEach(triangle => {
            triangle.classList.remove('blur');
            triangle.classList.add('no-blur');
            triangle.classList.remove('disabled')
  });
});
 });
});
