//git-from-scratch.js
// Written by Logan Donnelly
// Date Written: 10/02/2026

////////////////////////////////////////////////////////////////////////////////
//  Tutorial Features
////////////////////////////////////////////////////////////////////////////////

function Git(name) {
    this.name = name; 
    this.lastCommitId = -1; 
    this.branches = [];

    var master = new Branch("master", null);
    this.branches.push(master);
    this.HEAD = master;
}

function Commit(id, parent, message) {
    this.id = id;
    this.parent = parent;
    this.message = message; 
}

function Branch(name, commit) {
    this.name = name; 
    this.commit = commit;
}



Git.prototype.commit = function (message) {
    var commit = new Commit(++this.lastCommitId, this.HEAD.commit, message);

    this.HEAD.commit = commit;
    return commit;
}

Git.prototype.log = function () {
    var history = [];
    var current = this.HEAD.commit;

    while (current) {
        history.push(current);
        current = current.parent;
    }

    return history;
}

Git.prototype.checkout = function (branchName) {

    for (var i = this.branches.length; i--;) {
        if (this.branches[i].name === branchName) {
            console.log("Switched to existing branch: " + branchName);
            this.HEAD = this.branches[i];
            return;
        }
    }

    var newBranch = new Branch(branchName, this.HEAD.commit);
    this.branches.push(newBranch);
    this.HEAD = newBranch;
    console.log("Switched to new branch: " + branchName);
    return this; 
}

////////////////////////////////////////////////////////////////////////////////
//  Features I added myself (no vibe coding)
////////////////////////////////////////////////////////////////////////////////

Git.prototype.logOneLine = function () {

    var history = this.log();

    for (let i = 0; i < history.length; i++) {
        const id = history[i].id;
        const message = history[i].message; 
        const result = `${id} ${message}`;
        console.log(result);
    }
}

Git.prototype.status = function () {
    const branches = this.branches;
    console.log(`On branch ${this.HEAD.name}\n`);

    console.log('Branches:')

    for (const branch of branches) {
        if (branch === this.HEAD) {
            console.log(`* ${branch.name}`);
        } else {
            console.log(`${branch.name}`);
        }
    }

    console.log('\nLatest commit:');
    console.log(`${this.HEAD.commit.id} ${this.HEAD.commit.message}\n`);
}

Git.prototype.branchDelete = function (branchName) {
    let index = 0;
    for (const branch of this.branches) {
        if (branch.name === branchName && branch !== this.HEAD) {
            this.branches.splice(index, 1);
        }
        index++;
    }
}

////////////////////////////////////////////////////////////////////////////////
//  Tests -- console.log and console.assert statements
////////////////////////////////////////////////////////////////////////////////

console.log("3. Branches test");
var repo = new Git("test");
repo.commit("Initial commit");
repo.commit("First Commit/Change");

function historyToIDMapper(history) {
    var ids = history.map(function (commit) {
        return commit.id;
    });
    return ids.join("-");
}

console.assert(historyToIDMapper(repo.log()) === "1-0"); // Check if commit history is correct
console.log("ASSERTION 1 PASSED");

repo.checkout("testing");
repo.commit("change 3");

console.assert(historyToIDMapper(repo.log()) === "2-1-0"); // Check if commit history on testing branch is correct
console.log("ASSERTION 2 PASSED");

console.log("TESTING THE TESTING BRANCH:")
repo.status();


repo.checkout("master");
console.assert(historyToIDMapper(repo.log()) === "1-0"); // Check if commit history on master branch is correct
console.log("ASSERTION 3 PASSED");

repo.commit("Second change on master");
console.log("TESTING MASTER BRANCH:")
repo.branchDelete("testing");
repo.status();


console.assert(historyToIDMapper(repo.log()) === "3-1-0"); // Check if commit history on master branch is correct after new commit
console.log("ASSERTION 4 PASSED");