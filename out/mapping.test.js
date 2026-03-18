"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = require("node:assert/strict");
const node_test_1 = require("node:test");
const mapping_1 = require("./mapping");
(0, node_test_1.test)("resolveLinkedFileNameCandidates resolves all reachable names across links", () => {
    const links = [
        ["db.proc_{name}.sql", "db.table_{name}.sql"],
        ["db.table_{name}.sql", "module.{name}.sql"]
    ];
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.proc_customer.sql", links), [
        "db.table_customer.sql",
        "module.customer.sql"
    ]);
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.table_customer.sql", links), [
        "db.proc_customer.sql",
        "module.customer.sql"
    ]);
});
(0, node_test_1.test)("resolveLinkedFileNameCandidates avoids recursive name growth on ambiguous links", () => {
    const links = [["db.proc_{name}.sql", "db.{name}.sql"]];
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.proc_record.sql", links), ["db.record.sql"]);
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.record.sql", links), ["db.proc_record.sql"]);
});
(0, node_test_1.test)("resolveLinkedFileNameCandidates stops on cycles and avoids duplicates", () => {
    const links = [
        ["a.{name}.sql", "b.{name}.sql"],
        ["b.{name}.sql", "c.{name}.sql"],
        ["c.{name}.sql", "a.{name}.sql"]
    ];
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("a.demo.sql", links), ["b.demo.sql", "c.demo.sql"]);
});
(0, node_test_1.test)("resolveLinkedFileNameCandidates supports regex links", () => {
    const links = [
        ["/^db\\.proc_(.+)\\.sql$/", "db.table_$1.sql"],
        ["db.table_{name}.sql", "module.{name}.sql"]
    ];
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.proc_customer.sql", links), [
        "db.table_customer.sql",
        "module.customer.sql"
    ]);
});
(0, node_test_1.test)("resolveLinkedFileNameCandidates supports multi-target links in one entry", () => {
    const links = [["db.proc_{name}.sql", "db.table_{name}.sql", "module.{name}.sql"]];
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.proc_customer.sql", links), [
        "db.table_customer.sql",
        "module.customer.sql"
    ]);
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.table_customer.sql", links), [
        "db.proc_customer.sql",
        "module.customer.sql"
    ]);
});
(0, node_test_1.test)("resolveLinkedFileNameCandidates keeps multi-target links stable for ambiguous source matches", () => {
    const links = [["db.proc_{name}.sql", "db.{name}.sql", "module.{name}.sql"]];
    (0, strict_1.deepEqual)((0, mapping_1.resolveLinkedFileNameCandidates)("db.proc_record.sql", links), [
        "db.record.sql",
        "module.record.sql"
    ]);
});
(0, node_test_1.test)("isSupportedLinkPattern validates template and regex combinations", () => {
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["{name}.ts", "{name}.test.ts"]), true);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["a.{name}.sql", "b.{name}.sql", "c.{name}.sql"]), true);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["/^(.+)\\.ts$/", "$1.test.ts"]), true);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["/^(.+)\\.ts$/", "$1.test.ts", "$1.spec.ts"]), true);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["/^(.+)\\.ts$/", "/^(.+)\\.test\\.ts$/"]), false);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["/^(.+)\\.ts$/", "/^(.+)\\.test\\.ts$/", "$1.spec.ts"]), false);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["no-placeholder.ts", "{name}.test.ts"]), false);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["{name}.ts"]), false);
    (0, strict_1.equal)((0, mapping_1.isSupportedLinkPattern)(["/(/", "$1.test.ts"]), false);
});
//# sourceMappingURL=mapping.test.js.map