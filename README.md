# Ratatosk

Remote Webconsole for debugging when the devices console is not accessible for some reason (looking at you apple).

### components
Ratatosk consists of 3 parts:
1) Nidhogg: A scuffed wrapper around the normal web console
2) Eagle: A slightly modified Nidhogg running on the local machine
3) Ratatosk: the communication interface between Nidhogg and Eagle + a simple proxy which intercepts all responses from the target which contain html and adds an include for Nidhogg.

### config
In the `.env` a PORT and TARGET_SERVER must ge given.

### running Ratatosk
First install all dependencies and run `npm run compile` in the project root.
After that `npm run start` will start the server.
