function solution(A, X, Y, Z) {

    const waitingList = [];
    const [fuelDispensers,line ] = initLineAndDispensers(A, X, Y, Z);
    let freeDispenser;
    while (line.length > 0 || areCarsFuelingUp(fuelDispensers)) {
        if (line.length > 0) {
            if (!dispensersHaveCapacity(line[0].fuelNeed, fuelDispensers)) {
                return -1;
            }

            freeDispenser = getFreeDispenser(line[0].fuelNeed, fuelDispensers);
        }
        if (freeDispenser && line.length > 0) {
            freeDispenser.car = line.shift();
        } else {
            const [resolvedCars, fuelAmount] = resolveFuelUp(fuelDispensers);
            for (let car of line) {
                car.waitTime += fuelAmount;
            }
            waitingList.push(...resolvedCars);
        }

    }
    const maxWaitTime = Math.max(...waitingList);
    return maxWaitTime;

}

function initLineAndDispensers(A, X, Y, Z) {
    const fuelDispensers = [
        { capacity: X, car: null },
        { capacity: Y, car: null },
        { capacity: Z, car: null }
    ];
    const line = A.map(fuelNeed => ({ fuelNeed, waitTime: 0 }));
    return [fuelDispensers, line];
}

function dispensersHaveCapacity(fuelRequired, fuelDispensers) {
    return fuelDispensers.some(dispenser => dispenser.capacity >= fuelRequired);
}

function areCarsFuelingUp(fuelDispensers) {
    return fuelDispensers.some(dispenser => dispenser.car !== null);
}

function getFreeDispenser(fuelRequired, fuelDispensers) {
    for (let dispenser of fuelDispensers) {
        if (dispenser.capacity >= fuelRequired && !dispenser.car) {
            return dispenser;
        }
    }
    return null;
}

function resolveFuelUp(fuelDispensers) {
    const minFuelNeed = Math.min(
        ...fuelDispensers.filter(dispenser => dispenser.car).map(dispenser => dispenser.car.fuelNeed)
    );
    const fuledUpCarsWaitingTime = [];

    for (let dispenser of fuelDispensers) {
        if (dispenser.car) {
            dispenser.car.fuelNeed -= minFuelNeed;
            dispenser.capacity -= minFuelNeed;

            if (dispenser.car.fuelNeed <= 0) {
                fuledUpCarsWaitingTime.push(dispenser.car.waitTime);
                dispenser.car = null;
            }
        }
    }
    return [fuledUpCarsWaitingTime, minFuelNeed];
}