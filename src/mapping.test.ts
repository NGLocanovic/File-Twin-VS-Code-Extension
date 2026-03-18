import { deepEqual, equal } from "node:assert/strict";
import { test } from "node:test";
import {
  isSupportedLinkPattern,
  resolveLinkedFileNameCandidates,
  type LinkPattern
} from "./mapping";

test("resolveLinkedFileNameCandidates resolves all reachable names across links", () => {
  const links: LinkPattern[] = [
    ["db.proc_{name}.sql", "db.table_{name}.sql"],
    ["db.table_{name}.sql", "module.{name}.sql"]
  ];

  deepEqual(resolveLinkedFileNameCandidates("db.proc_customer.sql", links), [
    "db.table_customer.sql",
    "module.customer.sql"
  ]);

  deepEqual(resolveLinkedFileNameCandidates("db.table_customer.sql", links), [
    "db.proc_customer.sql",
    "module.customer.sql"
  ]);
});

test("resolveLinkedFileNameCandidates avoids recursive name growth on ambiguous links", () => {
  const links: LinkPattern[] = [["db.proc_{name}.sql", "db.{name}.sql"]];

  deepEqual(resolveLinkedFileNameCandidates("db.proc_record.sql", links), ["db.record.sql"]);
  deepEqual(resolveLinkedFileNameCandidates("db.record.sql", links), ["db.proc_record.sql"]);
});

test("resolveLinkedFileNameCandidates stops on cycles and avoids duplicates", () => {
  const links: LinkPattern[] = [
    ["a.{name}.sql", "b.{name}.sql"],
    ["b.{name}.sql", "c.{name}.sql"],
    ["c.{name}.sql", "a.{name}.sql"]
  ];

  deepEqual(resolveLinkedFileNameCandidates("a.demo.sql", links), ["b.demo.sql", "c.demo.sql"]);
});

test("resolveLinkedFileNameCandidates supports regex links", () => {
  const links: LinkPattern[] = [
    ["/^db\\.proc_(.+)\\.sql$/", "db.table_$1.sql"],
    ["db.table_{name}.sql", "module.{name}.sql"]
  ];

  deepEqual(resolveLinkedFileNameCandidates("db.proc_customer.sql", links), [
    "db.table_customer.sql",
    "module.customer.sql"
  ]);
});

test("resolveLinkedFileNameCandidates supports multi-target links in one entry", () => {
  const links: LinkPattern[] = [["db.proc_{name}.sql", "db.table_{name}.sql", "module.{name}.sql"]];

  deepEqual(resolveLinkedFileNameCandidates("db.proc_customer.sql", links), [
    "db.table_customer.sql",
    "module.customer.sql"
  ]);

  deepEqual(resolveLinkedFileNameCandidates("db.table_customer.sql", links), [
    "db.proc_customer.sql",
    "module.customer.sql"
  ]);
});

test("resolveLinkedFileNameCandidates keeps multi-target links stable for ambiguous source matches", () => {
  const links: LinkPattern[] = [["db.proc_{name}.sql", "db.{name}.sql", "module.{name}.sql"]];

  deepEqual(resolveLinkedFileNameCandidates("db.proc_record.sql", links), [
    "db.record.sql",
    "module.record.sql"
  ]);
});

test("isSupportedLinkPattern validates template and regex combinations", () => {
  equal(isSupportedLinkPattern(["{name}.ts", "{name}.test.ts"]), true);
  equal(isSupportedLinkPattern(["a.{name}.sql", "b.{name}.sql", "c.{name}.sql"]), true);
  equal(isSupportedLinkPattern(["/^(.+)\\.ts$/", "$1.test.ts"]), true);
  equal(isSupportedLinkPattern(["/^(.+)\\.ts$/", "$1.test.ts", "$1.spec.ts"]), true);
  equal(isSupportedLinkPattern(["/^(.+)\\.ts$/", "/^(.+)\\.test\\.ts$/"]), false);
  equal(
    isSupportedLinkPattern(["/^(.+)\\.ts$/", "/^(.+)\\.test\\.ts$/", "$1.spec.ts"] as unknown as LinkPattern),
    false
  );
  equal(isSupportedLinkPattern(["no-placeholder.ts", "{name}.test.ts"]), false);
  equal(isSupportedLinkPattern(["{name}.ts"] as unknown as LinkPattern), false);
  equal(isSupportedLinkPattern(["/(/", "$1.test.ts"]), false);
});
