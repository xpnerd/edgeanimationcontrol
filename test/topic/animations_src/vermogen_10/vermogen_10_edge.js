/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
        },
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [
        ],
        scripts = [
        ],
        symbols = {
            "stage": {
                version: "5.0.1",
                minimumCompatibleVersion: "5.0.0",
                build: "5.0.1.386",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'marktkraam_rood',
                            display: 'none',
                            type: 'image',
                            rect: ['466px', '153px', '402px', '353px', 'auto', 'auto'],
                            opacity: '0',
                            fill: ["rgba(0,0,0,0)",im+"marktkraam_rood.svg",'0px','0px']
                        },
                        {
                            id: 'marktkraam_blauw',
                            display: 'none',
                            type: 'image',
                            rect: ['23px', '153px', '402px', '353px', 'auto', 'auto'],
                            opacity: '0',
                            fill: ["rgba(0,0,0,0)",im+"marktkraam_blauw.svg",'0px','0px']
                        },
                        {
                            id: 'marktkraam_paars',
                            type: 'image',
                            rect: ['23px', '153px', '402px', '353px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"marktkraam_paars.svg",'0px','0px']
                        }
                    ],
                    style: {
                        '${Stage}': {
                            isStage: true,
                            rect: [undefined, undefined, '800px', '600px'],
                            overflow: 'hidden',
                            fill: ["rgba(255,255,255,0.00)"]
                        }
                    }
                },
                timeline: {
                    duration: 3750,
                    autoPlay: false,
                    labels: {
                        "act1": 0,
                        "act2": 1000,
                        "2b": 2160,
                        "act3": 2500
                    },
                    data: [
                        [
                            "eid3",
                            "left",
                            1000,
                            1000,
                            "linear",
                            "${marktkraam_rood}",
                            '23px',
                            '466px'
                        ],
                        [
                            "eid4",
                            "top",
                            1000,
                            1000,
                            "linear",
                            "${marktkraam_rood}",
                            '153px',
                            '13px'
                        ],
                        [
                            "eid21",
                            "top",
                            2500,
                            1000,
                            "linear",
                            "${marktkraam_blauw}",
                            '153px',
                            '313px'
                        ],
                        [
                            "eid13",
                            "opacity",
                            1000,
                            500,
                            "linear",
                            "${marktkraam_rood}",
                            '0',
                            '1'
                        ],
                        [
                            "eid18",
                            "width",
                            2500,
                            1000,
                            "linear",
                            "${marktkraam_blauw}",
                            '402px',
                            '309px'
                        ],
                        [
                            "eid24",
                            "opacity",
                            2500,
                            500,
                            "linear",
                            "${marktkraam_blauw}",
                            '0',
                            '1'
                        ],
                        [
                            "eid22",
                            "display",
                            2500,
                            0,
                            "linear",
                            "${marktkraam_blauw}",
                            'none',
                            'block'
                        ],
                        [
                            "eid11",
                            "display",
                            1000,
                            0,
                            "linear",
                            "${marktkraam_rood}",
                            'none',
                            'block'
                        ],
                        [
                            "eid10",
                            "width",
                            1000,
                            1000,
                            "linear",
                            "${marktkraam_rood}",
                            '402px',
                            '309px'
                        ],
                        [
                            "eid20",
                            "left",
                            2500,
                            1000,
                            "linear",
                            "${marktkraam_blauw}",
                            '23px',
                            '463px'
                        ],
                        [
                            "eid9",
                            "height",
                            1000,
                            1000,
                            "linear",
                            "${marktkraam_rood}",
                            '353px',
                            '271px'
                        ],
                        [
                            "eid19",
                            "height",
                            2500,
                            1000,
                            "linear",
                            "${marktkraam_blauw}",
                            '353px',
                            '271px'
                        ]
                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("vermogen_10_edgeActions.js");
})("vermogen_10");
