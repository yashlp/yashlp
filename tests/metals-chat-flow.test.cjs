#!/usr/bin/env node
"use strict";
const assert = require("assert");
const {
  createChatSession,
  processChatTurn,
  completePayment,
} = require("../src/lib/metals/chat-flow.ts");

function turn(session, text, estimate) {
  const r = processChatTurn(session, text, estimate);
  return r.session;
}

let s = createChatSession({
  grade: "EN-24",
  shape: "Round Bar",
  sizeMm: "50",
  lengthMm: "1000",
  quantityPieces: "5",
});

// confirm flow requires explicit yes
s = turn(s, "Yes, correct");
assert.equal(s.step, "confirm_shape", "grade yes -> shape");

s = turn(s, "maybe");
assert.equal(s.step, "confirm_shape", "noise should not advance");

s = turn(s, "Yes, correct");
assert.equal(s.step, "confirm_size");

s = turn(s, "Yes, correct");
s = turn(s, "Yes, correct");
s = turn(s, "Yes, correct");
assert.equal(s.step, "ask_name");

s = turn(s, "Test User");
assert.equal(s.step, "ask_phone");

s = turn(s, "9824012344");
assert.equal(s.step, "ask_email");

s = turn(s, "test@example.com");
assert.equal(s.step, "summary");

s = turn(s, "Proceed to payment");
assert.equal(s.step, "payment");

const done = completePayment(s);
assert.equal(done.session.step, "complete");

// change grade flow
let s2 = createChatSession({ grade: "EN-24", shape: "Round Bar", sizeMm: "50", lengthMm: "1000", quantityPieces: "2" });
const ch = processChatTurn(s2, "Change grade");
assert.equal(ch.session.awaitingField, "grade");
const ch2 = processChatTurn(ch.session, "EN-19 (4140)");
assert.equal(ch2.session.order.grade, "EN-19 (4140)");
assert.equal(ch2.session.step, "confirm_grade");

console.log("ok - chat flow state machine");
