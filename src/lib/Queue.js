const Bee = require('bee-queue');
const redisConfig = require('../config/redis');
const NewSubscription = require('../jobs/NewSubscription');

const queues = {};
const jobs = [NewSubscription];

jobs.forEach(({ key, handle }) => {
    queues[key] = { bee: new Bee(key, { redis: redisConfig }), handle }    
})

const add = (queue, job) => {
    return queues[queue].bee.createJob(job).save();
}

const processQueue = () => {
    jobs.forEach(job => {
        const { bee, handle } = queues[job.key];
        bee.on('failed', handleFailure).process(handle);
    })
}

const handleFailure = (job, err) => {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
}

export default { add, processQueue }