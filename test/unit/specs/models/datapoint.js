const testPoint = {
  lat: 52,
  long: 0.2,
  value: '0.5',
};

const testServerResponse = {
  body: {
    data: [
      testPoint,
    ],
  },
};

const testReading = {
  "@id" : "http://environment.data.gov.uk/flood-monitoring/data/readings/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm/2017-06-19T05-15-00Z" ,
  "dateTime" : "2017-06-19T05:15:00Z" ,
  "measure" : "http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm" ,
  "value" : 0.4,
}

module.exports = {
  testPoint,
  testServerResponse,
  testReading,
};
