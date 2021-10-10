var components = null;
var rec = null;
var result = [];

var openFileCompoents = function(event) {
        var input = event.target;

        var reader = new FileReader();
        reader.onload = function(){
          var text = reader.result;
          var parced = _.map(reader.result.split(/\r?\n/), (str)=>str.split(';'));
          components = _.map(parced, p => _.assign({}, {name: p[0], amount: p[1], parent: p[0] === p[2] ? null : p[2]}))
        };
        reader.readAsText(input.files[0]);
      };


var openFileRec = function(event) {
        var input = event.target;

        var reader = new FileReader();
        reader.onload = function(){
          var text = reader.result;
          var a = _.map(_.map(reader.result.split('---'), s => s.trim()), s => s.split(/\r?\n/));
          rec = _.map(a, lines => _.map(lines, line => line.split(';')));
        };
        reader.readAsText(input.files[0]);
      };


function recalulate() {
	_.forEach(rec, r =>{
		var baseObject = {exp: r[0][1], name: r[0][0], requirements: [], calculated: []};
		for (var i = 1; i<r.length;i++) {
			baseObject.requirements.push({name: r[i][0], amount: r[i][1]})
		}
		result.push(baseObject);
		_.forEach(baseObject.requirements, component => addToBase(baseObject, component))
		result[result.length - 1].calculated = _.groupBy(result[result.length - 1].calculated, 'name');
		_.forEach(result[result.length - 1].calculated, 
			(a, b) => result[result.length - 1].calculated[b] = _.sum(_.map(a, array => array.amount)));

		result[result.length - 1].requirements = null;
	})


	
	console.log(result)

	document.getElementById('output').value = _.join(_.map(result, obj => JSON.stringify(obj, null, 2)), "\n");
};

function addToBase(base, component) {
	var simple = _.filter(components, c => c.name && c.name.toUpperCase() === component.name.toUpperCase())
	_.forEach(simple, s => s.parent === null 
		? base.calculated.push({name: s.name, amount: +s.amount * +component.amount})
		: addToBase(base, {name: s.parent, amount: +s.amount * +component.amount}));
}


