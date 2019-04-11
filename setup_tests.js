import "@babel/polyfill";
import chai, { expect } from "chai"; // assertions
import sinon from "sinon";
import sinonChai from "sinon-chai"; // assertions for sinon
import sinonTest from "sinon-test";

chai.use(sinonChai);
global.expect = expect;

global.sinon = sinon;
sinon.test = sinonTest(sinon, { useFakeTimers: false });
