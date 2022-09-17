'use strict';
const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

function calculateHash() {
    return crypto
      .createHash('sha512')
      .update(
        this.height +
        this.timestamp +
        this.nonce +
        this.previousHash +
        this.miner +
        JSON.stringify(this.transactions) 
      )
      .digest('hex');
}

function createGenesisBlock() {
    return new Block(0, '', Date.now(), 0, '0', null, []);
}

function getLatestBlock() {
    return this.chain[this.chain.length - 1];
}

function minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      miningRewardAddress,
      'app_0000000000000000000000000000000000000000000000000000000000000000',
      []
    );
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.getLatestBlock().height + 1,
      '',
      Date.now(),
      0,
      this.getLatestBlock().hash,
      miningRewardAddress,
      this.pendingTransactions
    );
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [];
}

class Transaction {
    constructor(from, to, message = [], signature) {
      this.from = from;
      this.to = to;
      this.message = message;
      this.signature = signature;
    }
}

class Block {
    constructor(height, hash, timestamp, nonce, previousHash, miner, transactions = []) {
        this.height = height;
        this.hash = this.calculateHash();
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.previousHash = previousHash;
        this.miner = miner;
        this.transactions = transactions;
    }
}

class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.pendingTransactions = [];
    }
}

