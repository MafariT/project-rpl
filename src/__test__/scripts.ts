import autocannon from "autocannon";
import { faker } from "@faker-js/faker";

const generateUserData = () => ({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
});

const benchmarkPost = async () => {
    const url = "http://localhost:3000/";

    const instance = autocannon({
        url,
        method: "POST",
        body: JSON.stringify(generateUserData()),
        headers: {
            "Content-Type": "application/json",
        },
        connections: 1000,
        pipelining: 2,
        duration: 60,
    });

    autocannon.track(instance as any);
};

const benchmarkGet = async () => {
    const url = "http://localhost:3000/";

    const instance = autocannon({
        url,
        method: "GET",
        connections: 5000,
        pipelining: 10,
        duration: 10,
    });

    autocannon.track(instance as any);
};

const main = async () => {
    // console.log("Starting POST benchmark...");
    // await benchmarkPost();
    console.log("Starting GET benchmark...");
    await benchmarkGet();
};

main().catch((err) => console.error(err));
