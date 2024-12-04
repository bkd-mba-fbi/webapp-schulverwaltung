import * as t from "io-ts";

const StatusProcess = t.type({
  // DataClassId: null,
  // Id1: 0,
  // Id2: null,
  IdStatus: t.number,
  Status: t.string,
  // Direction: "forward",
  // StatusDate: null,
  // WorkProgressId: null,
  // IsDelete: false,
  // IdObject: "_30080",
  // HRef: "/CLX.Evento/api/StatusProcesses/_30080",
});

type StatusProcess = t.TypeOf<typeof StatusProcess>;
export { StatusProcess };
