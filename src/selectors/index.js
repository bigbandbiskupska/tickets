//import get from "lodash/get";

export const getBucketedSeats = (seats) => {
    let bucketedSeats = [];
    seats.forEach(seat => {
        if (!bucketedSeats[seat.y - 1]) {
            bucketedSeats[seat.y - 1] = []
        }
        if (!bucketedSeats[seat.y - 1][seat.x - 1]) {
            bucketedSeats[seat.y - 1][seat.x - 1] = seat
        }
    });

    return bucketedSeats;
};
