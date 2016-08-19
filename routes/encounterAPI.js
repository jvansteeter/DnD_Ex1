var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs-extra');
var User = mongoose.model('User');
var Encounter = mongoose.model('Encounter');
var EncounterPlayer = mongoose.model('EncounterPlayer');
var Character = mongoose.model('Character');
var Campaign = mongoose.model('Campaign');
var CampaignPost = mongoose.model('CampaignPost');
var CampaignUser = mongoose.model('CampaignUser');
var NPC = mongoose.model('NPC');
var formidable = require('formidable');
var path = require('path');

//
//  Encounter API
// /api/encounter
//

router.post('/create', function (req, res) {
    User.findById(req.user._id, function (error, user) {
        if (error) {
            res.status(500).send("Error finding user");
            return;
        }

        var name = user.first_name + " " + user.last_name;
        Encounter.create(
            {
                title: req.body.title,
                campaignID: req.body.campaignID,
                description: req.body.description,
                hostID: req.user._id,
                hostName: name,
                active: false
            }, function (error, encounter) {
                if (error) {
                    res.status(500).send("Error creating encounter");
                    return;
                }

                res.send("OK");
            });
    });
});

router.get('/all', function (req, res) {
    Encounter.find({$or: [{active: true}, {hostID: req.user._id}]}, function (error, encounters) {
        if (error) {
            res.status(500).send("Error finding encounters");
            return;
        }

        res.json(encounters);
    });
});

router.get('/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        res.json(encounter);
    });
});

router.post('/addplayer/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }
        var encounterPlayer = new EncounterPlayer(
            {
                name: req.body.name,
                userID: req.body.userID,
                initiative: req.body.initiative,
                armorClass: req.body.armorClass,
                hitPoints: req.body.hitPoints,
                maxHitPoints: req.body.maxHitPoints,
                visible: true,
                npc: false
            });
        encounter.addPlayer(encounterPlayer._id);
        encounterPlayer.save(function (error) {
            if (error) {
                res.status(500).send("Error saving encounter player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/addnpc/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }
        var encounterPlayer = new EncounterPlayer(
            {
                name: req.body.name,
                userID: req.body.userID,
                initiative: req.body.initiative,
                armorClass: req.body.armorClass,
                hitPoints: req.body.hitPoints,
                maxHitPoints: req.body.maxHitPoints,
                visible: false,
                npc: true
            });

        encounter.addPlayer(encounterPlayer._id);
        encounterPlayer.save(function (error) {
            if (error) {
                res.status(500).send("Error saving encounter player");
                return;
            }

            res.send("OK");
        });
    });
});


router.post('/addnpc2/:encounter_id', function (req, res) {
    var playersJSON = {};

    Encounter.findById(req.params.encounter_id, function (error, encounterState) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        EncounterPlayer.find({_id: {$in: encounterState.players}}, function (error, players) {
            if (error) {
                res.status(500).send("Error finding encounter players");
                return;
            }
            playersJSON = players;
        });

        var npcID = req.body.npcID;
        NPC.findById(npcID, function (error, npc) {
            if (error) {
                res.status(500).send("Error finding NPC");
                return;
            }

            var encounterPlayer = new EncounterPlayer(
                {
                    name: npc.name,
                    userID: npc.userID,
                    armorClass: npc.armorClass,
                    hitPoints: npc.hitPoints,
                    maxHitPoints: npc.hitPoints,
                    passivePerception: npc.passivePerception,
                    visible: false,
                    saves: npc.getSaves(),
                    npc: true
                });

            //calculate and assign mapX, mapY to encounterPlayer
            var tokenPlaced = false;
            var y = 0;
            var x = 0;

            while (!tokenPlaced) {
                var spaceIsFree = true;
                for (var i = 0; i < playersJSON.length; i++) {
                    var player = playersJSON[i];
                    if (player.mapX === x && player.mapY === y) {
                        spaceIsFree = false;
                    }
                }

                console.log("mapDimX:" + encounterState.mapDimX);

                if (spaceIsFree) {
                    encounterPlayer.mapX = x;
                    encounterPlayer.mapY = y;
                    tokenPlaced = true;
                }


                x++;
                if (x >= encounterState.mapDimX) {
                    x = 0;
                    y++
                }
            }

            encounterState.addPlayer(encounterPlayer._id);
            encounterPlayer.save(function (error) {
                if (error) {
                    res.status(500).send("Error saving encounter player");
                    return;
                }

                res.send("OK");
            });
        });
    });
});

router.post('/addcharacter/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        var characterID = req.body.characterID;
        Character.findById(characterID, function (error, character) {
            if (error) {
                res.status(500).send("Error finding character");
                return;
            }

            var encounterPlayer = new EncounterPlayer(
                {
                    name: character.name,
                    userID: character.userID,
                    armorClass: character.armorClass,
                    hitPoints: character.maxHitPoints,
                    maxHitPoints: character.maxHitPoints,
                    passivePerception: character.passivePerception,
                    visible: true,
                    saves: character.getSaves(),
                    npc: false
                });

            encounter.addPlayer(encounterPlayer._id);
            encounterPlayer.save(function (error) {
                if (error) {
                    res.status(500).send("Error saving encounter player");
                    return;
                }

                res.send("OK");
            });
        });
    });
});

router.post('/removeplayer/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        //res.json(encounterPlayer);
        encounter.removePlayer(req.body.playerID);
        EncounterPlayer.remove({_id: req.body.playerID}, function (error) {
            if (error) {
                res.status(500).send("Error removing encounter player");
                return;
            }
            res.send("OK");
        });
    });
});

router.get('/gamestate/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        EncounterPlayer.find({_id: {$in: encounter.players}}, function (error, players) {
            if (error) {
                res.status(500).send("Error finding encounter players");
                return;
            }

            encounter.players = players;
            res.json(encounter);
        });
    });
});

router.post('/hitplayer', function (req, res) {
    EncounterPlayer.findById(req.body.playerID, function (error, player) {
        if (error) {
            res.status(500).send("Error finding encounter player");
            return;
        }

        player.hitPoints += req.body.hit;
        if (!player.npc && player.hitPoints < -9) {
            player.status = "DEAD";
        }
        else if (player.npc && player.hitPoints < 1) {
            player.status = "DEAD"
        }

        player.save(function (error) {
            if (error) {
                res.status(500).send("Error saving encounter player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/setinitiative', function (req, res) {
    EncounterPlayer.findById(req.body.playerID, function (error, player) {
        if (error) {
            res.status(500).send("Error finding encounter player");
            return;
        }

        player.initiative = req.body.initiative;
        player.save(function (error) {
            if (error) {
                res.status(500).send("Error saving player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/togglevisible', function (req, res) {
    EncounterPlayer.findById(req.body.playerID, function (error, player) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        player.toggleVisible();
        player.save(function (error) {
            if (error) {
                res.status(500).send("Error saving player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/setactive/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        encounter.setActive(req.body.active);
        encounter.save(function (error) {
            if (error) {
                res.status(500).send("Error saving encounter");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/updatemapdata/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send("Error finding encounter");
            return;
        }

        encounter.mapResX = req.body.mapResX;
        encounter.mapResY = req.body.mapResY;
        encounter.mapDimX = req.body.mapDimX;
        encounter.mapDimY = req.body.mapDimY;

        encounter.save(function (error) {
            if (error) {
                res.status(500).send("Error saving encounter");
                return;
            }
            res.send("OK");
        });
    })
});

router.post('/updatenpc', function (req, res) {
    EncounterPlayer.findById(req.body.npc._id, function (error, player) {
        if (error) {
            res.status(500).send("Error finding encounter player");
            return;
        }

        player.setPlayer(req.body.npc);
        player.save(function (error) {
            if (error) {
                res.status(500).send("Error while saving update to npc");
                return;
            }

            res.send("OK");
        });
    });
});

router.get('/initwithoutmap/:encounter_id', function (req, res) {
    Encounter.findById(req.params.encounter_id, function (error, encounter) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        encounter.initialized = true;
        encounter.save(function (error) {
            if (error) {
                res.status(500).send(error);
                return;
            }

            res.send("OK");
        })
    });
});

router.post('/uploadmap/:encounter_id', function (req, res) {
    var encounterID = req.params.encounter_id;
    var directory = "image/encounters/" + encounterID + "/";
    var fileName = "map" + path.extname(req.files.file.file);

    fs.ensureDirSync(directory);

    fs.copy(req.files.file.file, directory + fileName, function (error) {
        if (error) {
            res.status(500).send(error);
            return;
        }

        Encounter.findById(encounterID, function (error, encounter) {
            if (error) {
                res.status(500).send(error);
                return;
            }

            encounter.initialized = true;
            encounter.mapURL = directory + fileName;
            encounter.save(function (error) {
                if (error) {
                    res.status(500).send(error);
                }

                fs.unlink(req.files.file.file, function (error) {
                    if (error) {
                        res.status(500).send(error);
                    }

                    res.send("OK");
                });
            });
        });
    });
});

module.exports = router;