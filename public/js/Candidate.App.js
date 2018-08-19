const app = angular.module("Candidate.App", []);

app.component("itmRoot", {
    controller: class {
        constructor() {
            this.candidates = [{ name: "Hyraxes", votes: 42, percent: 59 }, { name: "Kittehs", votes: 12, percent: 17 }, { name: "Puppies", votes: 10, percent: 14 }, { name: "Gerbils", votes: 7, percent: 10 },];
            this.totalVotes = 71;
        }

        onVote(candidate) {
            console.log(`Vote for ${candidate.name}`);
            candidate.votes++;
            // this.candidates.append(candidate.name, candidate.votes++);
            // for (var i = this.candidates.length - 1; i >= 0; i--) {
            //     if (this.candidates[i].votes < candidate.votes) {
            //         this.candidates.splice(i, 1);
            //     }
            // }
            this.candidates.sort(function (a, b) {
                return a.votes - b.votes;
            });
            this.candidates.reverse();
            const reducer = ((accumulator, currentValue) => ({ votes: accumulator.votes + currentValue.votes }));
            const totalVotes = this.candidates.reduce(reducer);
            console.log(totalVotes);
            this.findPercentage(totalVotes);
        }

        findPercentage(totalVotes) {
            this.candidates.forEach(function (element) {
                let percent = (element.votes / totalVotes.votes)*100;
                let percentOfVotes = Math.round(percent);
                console.log(percentOfVotes);
                element.percent = percentOfVotes;
            });
        }

        onAddCandidate(candidate) {
            for (var i = this.candidates.length - 1; i >= 0; i--) {
                if (this.candidates[i].name === candidate.name) {
                    console.log('Candidate already exists.');
                    return 0;
                }
                else if (candidate.name === "") {
                    console.log('Please enter a candidate name.');
                    return 0;
                }
            }
            console.log(`Added candidate ${candidate.name}`);
            this.candidates.push(candidate);
        }

        onRemoveCandidate(candidate) {
            console.log(`Removed candidate ${candidate.name}`);
            for (var i = this.candidates.length - 1; i >= 0; i--) {
                if (this.candidates[i] === candidate) {
                    this.candidates.splice(i, 1);
                }
            }
        }
    },
    template: `
        <h1>Which candidate brings the most joy?</h1>
             
        <itm-results 
            candidates="$ctrl.candidates">
        </itm-results>

        <itm-vote 
            candidates="$ctrl.candidates"
            on-vote="$ctrl.onVote($candidate)">
        </itm-vote>

        <itm-management 
            candidates="$ctrl.candidates"
            on-add="$ctrl.onAddCandidate($candidate)"
            on-remove="$ctrl.onRemoveCandidate($candidate)">
        </itm-management>
    `
});

app.component("itmManagement", {
    bindings: {
        candidates: "<",
        onAdd: "&",
        onRemove: "&"
    },
    controller: class {
        constructor() {
            this.newCandidate = {
                name: "",
                votes: 0
            };
        }

        submitCandidate(candidate) {
            this.onAdd({ $candidate: candidate });
        }

        removeCandidate(candidate) {
            this.onRemove({ $candidate: candidate });
        }
    },
    template: `
        <h2>Manage Candidates</h2>

        <h3>Add New Candidate</h3>
        <form ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" novalidate>

            <label>Candidate Name</label>
            <input type="text" ng-model="$ctrl.newCandidate.name" required>

            <button type="submit" >Add</button>
        </form>

        <h3>Remove Candidate</h3>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates">
                <span ng-bind="candidate.name"></span>
                <button type="button" ng-click="$ctrl.removeCandidate(candidate)">X</button>
            </li>
        </ul>

    `
});

app.component("itmVote", {
    bindings: {
        candidates: "<",
        onVote: "&",
    },
    controller: class { },
    template: `
        <h2>Cast your vote!</h2>

        <button type="button"
            ng-repeat="candidate in $ctrl.candidates"
            ng-click="$ctrl.onVote({ $candidate: candidate })">
            <span ng-bind="candidate.name"></span>
        </button>
    `
});

app.component("itmResults", {
    bindings: {
        candidates: "<",
        totalVotes: "="
    },
    controller: class { },
    template: `
        <h2>Live Results</h2>
        <ul>
            <li ng-repeat="candidate in $ctrl.candidates">
                <span ng-bind="candidate.name"></span>
                Votes:<strong ng-bind="candidate.votes"></strong>
                --<strong ng-bind="candidate.percent"></strong>%
            </li>
        </ul>
        <h3>Total Votes:<h3>
        <span ng-bind="totalVotes"></span>
    `
});
