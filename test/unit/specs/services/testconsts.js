const testTideReading = {
  "@id" : "http://environment.data.gov.uk/flood-monitoring/data/readings/E70039-level-tidal_level-Mean-15_min-mAOD/2017-07-05T06-15-00Z" ,
  "date" : "2017-07-05" ,
  "dateTime" : "2017-07-05T06:15:00Z" ,
  "measure" : {
    "@id" : "http://environment.data.gov.uk/flood-monitoring/id/measures/E70039-level-tidal_level-Mean-15_min-mAOD" ,
    "datumType" : "http://environment.data.gov.uk/flood-monitoring/def/core/datumAOD" ,
    "parameter" : "level" ,
    "period" : 900 ,
    "qualifier" : "Tidal Level" ,
    "station" : {
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/E70039" ,
      "label" : "Lowestoft"
    }
     ,
    "stationReference" : "E70039" ,
    "unitName" : "mAOD" ,
    "valueType" : "mean"
  }
   ,
  "value" : 0.691
}

const testTideReadings =
  {
    "@context" : "http://environment.data.gov.uk/flood-monitoring/meta/context.jsonld" ,
    "meta" : {
      "publisher" : "Environment Agency" ,
      "licence" : "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" ,
      "documentation" : "http://environment.data.gov.uk/flood-monitoring/doc/reference" ,
      "version" : "0.7" ,
      "comment" : "Status: Beta service" ,
      "hasFormat" : [ "http://environment.data.gov.uk/flood-monitoring/data/readings.csv?qualifier=Tidal%20Level&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.rdf?qualifier=Tidal%20Level&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.ttl?qualifier=Tidal%20Level&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.html?qualifier=Tidal%20Level&_view=full&_limit=1" ] ,
      "limit" : 1
    }
     ,
    "items" : [ testTideReading ]
  }

const testRiverReading = { 
  "@id" : "http://environment.data.gov.uk/flood-monitoring/data/readings/1029TH-level-stage-i-15_min-mASD/2017-07-06T02-45-00Z" ,
  "date" : "2017-07-06" ,
  "dateTime" : "2017-07-06T02:45:00Z" ,
  "measure" : { 
    "@id" : "http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-stage-i-15_min-mASD" ,
    "datumType" : "http://environment.data.gov.uk/flood-monitoring/def/core/datumASD" ,
    "parameter" : "level" ,
    "period" : 900 ,
    "qualifier" : "Stage" ,
    "station" : { 
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH" ,
      "label" : "Bourton Dickler"
    }
     ,
    "stationReference" : "1029TH" ,
    "unitName" : "mASD" ,
    "valueType" : "instantaneous"
  }
   ,
  "value" : 0.076
}

const testRiverReadings = { 
  "@context" : "http://environment.data.gov.uk/flood-monitoring/meta/context.jsonld" ,
  "meta" : { 
    "publisher" : "Environment Agency" ,
    "licence" : "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" ,
    "documentation" : "http://environment.data.gov.uk/flood-monitoring/doc/reference" ,
    "version" : "0.7" ,
    "comment" : "Status: Beta service" ,
    "hasFormat" : [ "http://environment.data.gov.uk/flood-monitoring/data/readings.csv?qualifier=Stage&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.rdf?qualifier=Stage&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.ttl?qualifier=Stage&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.html?qualifier=Stage&_view=full&_limit=1" ] ,
    "limit" : 1
  }
   ,
  "items" : [ testRiverReading ]
}

const testRainReading = {
  "@id" : "http://environment.data.gov.uk/flood-monitoring/data/readings/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm/2017-07-05T05-15-00Z" ,
  "date" : "2017-07-05" ,
  "dateTime" : "2017-07-05T05:15:00Z" ,
  "measure" : {
    "@id" : "http://environment.data.gov.uk/flood-monitoring/id/measures/E7050-rainfall-tipping_bucket_raingauge-t-15_min-mm" ,
    "parameter" : "rainfall" ,
    "period" : 900 ,
    "qualifier" : "Tipping Bucket Raingauge" ,
    "station" : {
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/E7050" ,
      "label" : "Crowhurst"
    }
     ,
    "stationReference" : "E7050" ,
    "unitName" : "mm" ,
    "valueType" : "total"
  }
   ,
  "value" : 0.0
}


const testRainReadings = { 
  "@context" : "http://environment.data.gov.uk/flood-monitoring/meta/context.jsonld" ,
  "meta" : { 
    "publisher" : "Environment Agency" ,
    "licence" : "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" ,
    "documentation" : "http://environment.data.gov.uk/flood-monitoring/doc/reference" ,
    "version" : "0.7" ,
    "comment" : "Status: Beta service" ,
    "hasFormat" : [ "http://environment.data.gov.uk/flood-monitoring/data/readings.csv?parameter=rainfall&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.rdf?parameter=rainfall&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.ttl?parameter=rainfall&_view=full&_limit=1", "http://environment.data.gov.uk/flood-monitoring/data/readings.html?parameter=rainfall&_view=full&_limit=1" ] ,
    "limit" : 1
  }
   ,
  "items" : [ testRainReading ]
}

const testStation = {
    "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH" ,
    "RLOIid" : "7041" ,
    "catchmentName" : "Cotswolds" ,
    "dateOpened" : "1994-01-01" ,
    "easting" : 417990 ,
    "label" : "Bourton Dickler" ,
    "lat" : 51.874767 ,
    "long" : -1.740083 ,
    "measures" : [ { 
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-downstage-i-15_min-mASD" ,
      "parameter" : "level" ,
      "parameterName" : "Water Level" ,
      "period" : 900 ,
      "qualifier" : "Downstream Stage" ,
      "unitName" : "mASD"
    }
    , { 
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/measures/1029TH-level-stage-i-15_min-mASD" ,
      "parameter" : "level" ,
      "parameterName" : "Water Level" ,
      "period" : 900 ,
      "qualifier" : "Stage" ,
      "unitName" : "mASD"
    }
     ] ,
    "northing" : 219610 ,
    "notation" : "1029TH" ,
    "riverName" : "Dikler" ,
    "stageScale" : { 
      "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH/stageScale" ,
      "highestRecent" : { 
        "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH/stageScale/highestRecent" ,
        "dateTime" : "2014-01-04T19:00:00" ,
        "value" : 0.602
      }
       ,
      "maxOnRecord" : { 
        "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH/stageScale/maxOnRecord" ,
        "dateTime" : "2007-07-20T21:00:00" ,
        "value" : 0.82
      }
       ,
      "minOnRecord" : { 
        "@id" : "http://environment.data.gov.uk/flood-monitoring/id/stations/1029TH/stageScale/minOnRecord" ,
        "dateTime" : "2003-09-17T21:00:00" ,
        "value" : 0.05
      }
       ,
      "scaleMax" : 3 ,
      "typicalRangeHigh" : 0.42 ,
      "typicalRangeLow" : 0.068
    }
     ,
    "stationReference" : "1029TH" ,
    "status" : "http://environment.data.gov.uk/flood-monitoring/def/core/statusActive" ,
    "town" : "Little Rissington" ,
    "wiskiID" : "1029TH"
  }


const testStations = {
  "@context" : "http://environment.data.gov.uk/flood-monitoring/meta/context.jsonld" ,
  "meta" : {
    "publisher" : "Environment Agency" ,
    "licence" : "http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" ,
    "documentation" : "http://environment.data.gov.uk/flood-monitoring/doc/reference" ,
    "version" : "0.7" ,
    "comment" : "Status: Beta service" ,
    "hasFormat" : [ "http://environment.data.gov.uk/flood-monitoring/id/stations.csv?_view=full", "http://environment.data.gov.uk/flood-monitoring/id/stations.rdf?_view=full", "http://environment.data.gov.uk/flood-monitoring/id/stations.ttl?_view=full", "http://environment.data.gov.uk/flood-monitoring/id/stations.html?_view=full" ]
  }
   ,
  "items" : [ testStation ]
}

export { testTideReadings, testTideReading, testRiverReading, testRiverReadings, testRainReading, testRainReadings, testStation, testStations };
