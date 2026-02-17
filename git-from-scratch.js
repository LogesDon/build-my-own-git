//git-from-scratch.js
// Written by Logan Donnelly
// Date Written: 10/02/2026


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

const user = 'N1H4R';
const welcome = `Welcome to SoloLearn, ${user}!`;


// TODO: implement git log --oneline function 
// What I'm thinking: traverse linked list of commits and return an array of strings with the format "id: message" for each commit.
Git.prototype.logOneLine = function () {

    var history = this.log();

    for (let i = 0; i < history.length; i++) {
        const id = history[i].id;
        const message = history[i].message; 
        const result = `${id} ${message}`;
        console.log(result);
    }
}


// Examples and Tests
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

repo.checkout("testing");
repo.commit("change 3");

console.assert(historyToIDMapper(repo.log()) === "2-1-0"); // Check if commit history on testing branch is correct

console.log("TESTING THE TESTING BRANCH:")
repo.logOneLine();

repo.checkout("master");
console.assert(historyToIDMapper(repo.log()) === "1-0"); // Check if commit history on master branch is correct

repo.commit("Second change on master");
console.log("TESTING MASTER BRANCH:")
repo.logOneLine();


console.assert(historyToIDMapper(repo.log()) === "3-1-0"); // Check if commit history on master branch is correct after new commit