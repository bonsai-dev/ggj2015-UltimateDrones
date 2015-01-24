function WorkManager(){
    this.drones = [];
    this.buildings = [];

}

DroneManager.prototype = {
    update: function() {
        this.drones.forEach(function (drone) {
            drone.tick();


            if (drone.status === 'idle') {
                //move drone to assigned building?
            }

        });

        this.buildings.forEach(function (building) {
            building.tick();


        });
    }
};
