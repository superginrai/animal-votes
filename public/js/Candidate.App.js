const app = angular.module("Candidate.App", ['ngRoute', 'ngMaterial']);

app.component("itmRoot", {
    controller: class {
        constructor() {
            this.candidates = [{ name: "Hyraxes", votes: 42, percent: 59, image_path: "https://a-z-animals.com/media/animals/images/470x370/rock_hyrax.jpg" },
            { name: "Kittehs", votes: 12, percent: 17, image_path: "/images/snarf.jpg" },
            { name: "Puppies", votes: 10, percent: 14, image_path: "http://1857el3tlg4r2uc4w82vmnbh.wpengine.netdna-cdn.com/wp-content/uploads/2017/01/what-does-a-pomchi-look-like-pomchi-dogs-and-puppies-01.jpg" },
            { name: "Gerbils", votes: 7, percent: 10, image_path: "https://www.pets4homes.co.uk/images/articles/72/c79ef5a8f628b6ed82f88512ea00ca9f.jpg" },];
            
            this.totalVotes = 71;
        }

        onVote(candidate) {
            console.log(`Vote for ${candidate.name}`);
            candidate.votes++;
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
                let percent = (element.votes / totalVotes.votes) * 100;
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
            candidates="$ctrl.candidates"
            on-vote="$ctrl.onVote($candidate)"
            on-remove="$ctrl.onRemoveCandidate($candidate)"
            totalVotes="$ctrl.totalVotes">
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
    template: 
        // <h2>Manage Candidates</h2>
`
        <h3>Add New Candidate</h3>
        <form ng-submit="$ctrl.submitCandidate($ctrl.newCandidate)" novalidate>

            <label>Candidate Name</label>
            <input type="text" ng-model="$ctrl.newCandidate.name" required>

            <md-button type="submit" >Add</md-button>
        </form>`

    //     <h3>Remove Candidate</h3>
    //     <ul>
    //         <li ng-repeat="candidate in $ctrl.candidates">
    //             <span ng-bind="candidate.name"></span>
    //             <md-button class="md-icon-button" ng-click="$ctrl.removeCandidate(candidate)">
    //             <i class="material-icons">delete</i>
    //         </md-button>
    //         </li>
    //     </ul>

    // `
});

// app.component("itmVote", {
//     bindings: {
//         candidates: "<",
//         onVote: "&",
//     },
//     controller: class { },
//     template: `
//         <h2>Cast your vote!</h2>

//         <button type="button"
//             ng-repeat="candidate in $ctrl.candidates"
//             ng-click="$ctrl.onVote({ $candidate: candidate })">
//             <span ng-bind="candidate.name"></span>
//         </button>
//     `
// });

app.component("itmResults", {
    bindings: {
        candidates: "<",
        onVote: "&",
        onRemove: "&",
        totalVotes: "&"
        // totalVotes: "="
    },
    controller: class { 
        removeCandidate(candidate) {
            this.onRemove({ $candidate: candidate });
        }

    },
    template:
        // <h2>Live Results</h2>
   `
        <md-content class="md-padding" layout-xs="column" layout="row" layout-wrap>
        <div flex-xs flex-gt-xs="30" layout="column" ng-repeat="candidate in $ctrl.candidates">
            <md-card>
            <md-card-title>
                <md-card-title-text>
                    <span class="md-headline"><strong ng-bind="candidate.name"></strong></span>
                    <span>Votes:<strong ng-bind="candidate.votes"></strong></span>
                    <span>Percent of Total Votes:<strong ng-bind="candidate.percent"></strong>%</span>
                </md-card-title-text>
            </md-card-title>
            <md-card-content layout="row" layout-align="space-between">
            <div class="md-media-xl card-media">
            <img ng-src={{candidate.image_path}} alt="no picture available" style="width: 275px;">
        </div>
        <md-card-actions layout="column">
        <md-button class="md-icon-button" ng-click="$ctrl.onVote({ $candidate: candidate })">
        <i class="material-icons">favorite</i>
        </md-button>
            <md-button class="md-icon-button" ng-click="$ctrl.removeCandidate(candidate)">
            <i class="material-icons">delete</i>
        </md-button>
        </md-card-actions>
            </md-card-content>
        </md-card>
        </div>
    `
});

{/* <h3>Total Votes:<h3>
<span ng-bind="$ctrl.totalVotes"></span> */}