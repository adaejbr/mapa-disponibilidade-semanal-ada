import localforage from 'localforage';

// Configure localForage to use a specific database and store name
localforage.config({
  name: 'AdaAvailabilityDB',
  storeName: 'availability_store',
  description: 'Storage for weekly availability map data',
});

export default localforage;
