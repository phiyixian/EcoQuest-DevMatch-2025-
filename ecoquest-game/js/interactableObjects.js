// Raw interactables from Tiled (unchanged)
const interactables = [
    {
      "height": 23.0379358009522,
      "id": 24,
      "name": "",
      "properties": [
        {
          "name": "This is a mushroom",
          "type": "string",
          "value": ""
        }
      ],
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 26.1096605744125,
      "x": 356.320073721395,
      "y": 293.349715865458
    },
    {
      "height": 27.2192785076577,
      "id": 25,
      "name": "",
      "properties": [
        {
          "name": "This is a tree",
          "type": "string",
          "value": ""
        }
      ],
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 31.2114393554475,
      "x": 415.547651883574,
      "y": 290.701894461784
    },
    {
      "height": 59.3591905564924,
      "id": 26,
      "name": "",
      "properties": [
        {
          "name": "These are cows",
          "type": "string",
          "value": ""
        }
      ],
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 59.3591905564924,
      "x": 386.509274873524,
      "y": 675.210792580101
    },
    {
      "height": 94.4350758853288,
      "id": 27,
      "name": "",
      "properties": [
        {
          "name": "This is another type of tree",
          "type": "string",
          "value": ""
        }
      ],
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 97.133220910624,
      "x": 576.053962900506,
      "y": 671.163575042159
    },
    {
      "height": 30.7438923963766,
      "id": 28,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 31.2928904748834,
      "x": 863.573977491079,
      "y": 382.651660719187
    },
    {
      "height": 30.1948943178699,
      "id": 29,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 30.19489431787,
      "x": 962.393631622289,
      "y": 351.358770244304
    },
    {
      "height": 92.2316771891299,
      "id": 30,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 64.7817732637935,
      "x": 963.491627779303,
      "y": 543.508097721658
    },
    {
      "height": 63.6837771067801,
      "id": 31,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 34.0378808674169,
      "x": 863.024979412572,
      "y": 606.642876749931
    },
    {
      "height": 41.7238539665111,
      "id": 32,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 39.5278616524843,
      "x": 1051.88031841889,
      "y": 509.470216854241
    },
    {
      "height": 43.919846280538,
      "id": 33,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 43.3708482020313,
      "x": 1181.99286302498,
      "y": 509.470216854241
    }
  ];
  
  const interactableObjects = interactables.map(obj => {
    let description = 'No description provided';
  
    if (Array.isArray(obj.properties) && obj.properties.length > 0) {
      // Take the name of the first property as the description
      description = obj.properties[0].name || description;
    }
  
    return {
      position: {
        x: obj.x,
        y: obj.y
      },
      width: obj.width,
      height: obj.height,
      description: description,
      highlight: false
    };
  });
  
  console.log("Processed interactable objects:", interactableObjects);