import "@babel/polyfill";
import chai, { expect } from "chai"; // assertions
import sinon from "sinon";
import sinonChai from "sinon-chai"; // assertions for sinon

chai.use(sinonChai);
global.expect = expect;

global.sinon = sinon;
