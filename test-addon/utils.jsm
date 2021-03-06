/* eslint no-unused-vars: "off" */

const { studyUtils } = Components.utils.import("resource://test-addon/StudyUtils.jsm", {});
Components.utils.import("resource://gre/modules/TelemetryArchive.jsm");
Components.utils.import("resource://gre/modules/Console.jsm");

var EXPORTED_SYMBOLS = ["fakeSetup", "getMostRecentPingsByType"];

function fakeSetup() {
  studyUtils.setup({
    studyName: "shield-utils-test",
    endings: {
      "expired": {
        "baseUrl": "http://www.example.com/?reason=expired",
      }},
    addon: {id: "1", version: "1"},
    telemetry: { send: true, removeTestingFlag: false },
  });
  studyUtils.setVariation({ name: "puppers", weight: "2" });
}

// Returns array of pings of type `type` in sorted order by timestamp
// first element is most recent ping
async function getMostRecentPingsByType(type) {
  const pings = await TelemetryArchive.promiseArchivedPingList();

  const filteredPings = pings.filter(p => p.type === type);
  filteredPings.sort((a, b) => b.timestampCreated - a.timestampCreated);

  const pingData = filteredPings.map(ping => TelemetryArchive.promiseArchivedPingById(ping.id));
  return Promise.all(pingData);
}
