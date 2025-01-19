(async function() {
    var e = ["emulator.js", "nipplejs.js", "shaders.js", "storage.js", "gamepad.js", "GameManager.js", "socket.io.min.js", "compression.js"], // Fichiers à charger
        t = function(e) { return e.substring(0, e.length - e.split('/').pop().length); }, // Fonction pour obtenir le chemin du dossier
        r = window.EJS_pathtodata && "string" == typeof window.EJS_pathtodata ? window.EJS_pathtodata : t((new URL(document.currentScript.src)).pathname); // Récupère le chemin de script
    if (!r.endsWith("/")) r += "/"; // Ajoute un "/" à la fin si nécessaire

    function o(e) { // Fonction pour charger un script
        return new Promise(function(t, r) {
            var n = document.createElement("script");
            n.src = function() {
                if (void 0 != typeof EJS_paths && "string" == typeof EJS_paths[e]) return EJS_paths[e]; // Si le fichier existe dans EJS_paths, utilise cette URL
                else return r + e; // Sinon charge depuis le chemin local
            }();
            n.onload = t;
            n.onerror = function() { s(e).then(function() { return t(); }) }; // En cas d'erreur, tente de charger les fichiers non minifiés
            document.head.appendChild(n);
        });
    }

    function c(e) { // Fonction pour charger une feuille de style
        return new Promise(function(t, r) {
            var n = document.createElement("link");
            n.rel = "stylesheet";
            n.href = function() {
                if (void 0 != typeof EJS_paths && "string" == typeof EJS_paths[e]) return EJS_paths[e]; // Si le fichier existe dans EJS_paths, utilise cette URL
                else return r + e; // Sinon charge depuis le chemin local
            }();
            n.onload = t;
            n.onerror = function() { s(e).then(function() { return t(); }) }; // En cas d'erreur, tente de charger les fichiers non minifiés
            document.head.appendChild(n);
        });
    }

    async function s(e) { // Fonction pour gérer les fichiers manquants
        console.error("Failed to load " + e);
        var t = e.includes(".min.") && !e.includes("socket");
        console[t ? "warn" : "error"]("Failed to load " + e + " because it's likely that the minified files are missing. To fix this, you have 3 options...");
        if (t) {
            console.log("Attempting to load non-minified files");
            if (e === "emulator.min.js") {
                for (var n = 0; n < e.length; n++) await o(e[n]); // Charger tous les scripts si l'un d'eux échoue
            } else await c("emulator.css"); // Charger le style si nécessaire
        }
    }

    if ("undefined" != typeof EJS_DEBUG_XX && !0 === EJS_DEBUG_XX) { // Si en mode debug, charger tous les scripts
        for (var i = 0; i < e.length; i++) await o(e[i]);
        await c("emulator.css");
    } else { // Sinon charger les versions minimisées
        await o("emulator.min.js");
        await c("emulator.min.css");
    }

    // Configuration de l'émulateur sans la partie publicitaire
    var l = {};
    l.gameUrl = window.EJS_gameUrl;
    l.dataPath = r;
    l.system = window.EJS_core;
    l.biosUrl = window.EJS_biosUrl;
    l.gameName = window.EJS_gameName;
    l.color = window.EJS_color;
    l.alignStartButton = window.EJS_alignStartButton;
    l.VirtualGamepadSettings = window.EJS_VirtualGamepadSettings;
    l.buttonOpts = window.EJS_Buttons;
    l.volume = window.EJS_volume;
    l.defaultControllers = window.EJS_defaultControls;
    l.startOnLoad = window.EJS_startOnLoaded;
    l.fullscreenOnLoad = window.EJS_fullscreenOnLoaded;
    l.filePaths = window.EJS_paths;
    l.loadState = window.EJS_loadStateURL;
    l.cacheLimit = window.EJS_CacheLimit;
    l.cheats = window.EJS_cheats;
    l.defaultOptions = window.EJS_defaultOptions;
    l.gamePatchUrl = window.EJS_gamePatchUrl;
    l.gameParentUrl = window.EJS_gameParentUrl;
    l.netplayUrl = window.EJS_netplayServer;
    l.gameId = window.EJS_gameID;
    l.backgroundImg = window.EJS_backgroundImage;
    l.backgroundBlur = window.EJS_backgroundBlur;
    l.backgroundColor = window.EJS_backgroundColor;
    l.controlScheme = window.EJS_controlScheme;
    l.threads = window.EJS_threads;
    l.disableCue = window.EJS_disableCue;
    l.startBtnName = window.EJS_startButtonName;
    l.softLoad = window.EJS_softLoad;
    l.screenRecording = window.EJS_screenRecording;
    l.externalFiles = window.EJS_externalFiles;
    l.disableDatabases = window.EJS_disableDatabases;
    l.disableLocalStorage = window.EJS_disableLocalStorage;
    l.forceLegacyCores = window.EJS_forceLegacyCores;
    l.noAutoFocus = window.EJS_noAutoFocus;
    l.videoRotation = window.EJS_videoRotation;
    l.shaders = Object.assign({}, window.EJS_SHADERS, window.EJS_shaders ? window.EJS_shaders : {});
    
    // Suppression de la partie publicité
    // Code supprimé : window.EJS_adUrl, window.EJS_AdMode, window.EJS_AdTimer, window.EJS_AdSize, EJS_emulator.adBlocked

    if (typeof window.EJS_language === "string" && window.EJS_language !== "en-US") {
        try {
            let path;
            if ('undefined' != typeof EJS_paths && typeof EJS_paths[window.EJS_language] === 'string') {
                path = EJS_paths[window.EJS_language];
            } else {
                path = r + "localization/" + window.EJS_language + ".json";
            }
            l.language = window.EJS_language;
            l.langJson = JSON.parse(await (await fetch(path)).text());
        } catch(e) {
            l.langJson = {};
        }
    }

    window.EJS_emulator = new EmulatorJS(EJS_player, l);
    // Ajouter des écouteurs d'événements pour différentes actions
    if ("function" == typeof window.EJS_ready) window.EJS_emulator.on("ready", window.EJS_ready);
    if ("function" == typeof window.EJS_onGameStart) window.EJS_emulator.on("start", window.EJS_onGameStart);
    if ("function" == typeof window.EJS_onLoadState) window.EJS_emulator.on("loadState", window.EJS_onLoadState);
    if ("function" == typeof window.EJS_onSaveState) window.EJS_emulator.on("saveState", window.EJS_onSaveState);
    if ("function" == typeof window.EJS_onLoadSave) window.EJS_emulator.on("loadSave", window.EJS_onLoadSave);
    if ("function" == typeof window.EJS_onSaveSave) window.EJS_emulator.on("saveSave", window.EJS_onSaveSave);
})();
