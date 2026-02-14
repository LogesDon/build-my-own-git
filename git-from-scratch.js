//git-from-scratch.js
// Written by Logan Donnelly
// Date Written: 10/02/2026


function Git(name) {
    this.name = name; 
    this.lastCommitId = -1; 
    this.HEAD = null;
}

function Commit(id, parent, message) {
    this.id = id;
    this.parent = parent;
    this.message = message; 
}

Git.prototype.commit = function (message) {
    var commit = new Commit(++this.lastCommitId, this.HEAD, message);
    this.HEAD = commit;
    return commit;
}

Git.prototype.log = function () {
    var history = [];
    var current = this.HEAD;

    while (current) {
        history.push(current);
        current = current.parent;
    }

    return history;
}


// window.Git = Git;

// Examples and Tests
console.log("Git.log() test");
var repo = new Git("test");
repo.commit("Initial commit");
repo.commit("Change 1");

var log = repo.log();
console.assert(log.length === 2); // Check if log has 2 commits
console.assert(!!log[0] && log[0].id === 1); // Commit 1 should be first
console.assert(!!log[1] && log[1].id === 0); // And then Commit 0. 