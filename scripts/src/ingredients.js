
var IngredientEditor = React.createClass({
	getInitialState: function () {	
		return {
			data: JSON.parse(decodeHtml(this.props.data))
		}
	},
	encodeJson: function () {
		return escapeHtml(JSON.stringify(this.state.data));
	},
	removeItem: function (index) {
		var data = this.state.data;

		data.splice(index, 1);

		this.setState({
			data: data
		});
	},
	addItem: function () {
		var data = this.state.data;

		data.push({});

		this.setState({
			data: data
		});
	},
	updateField: function (index, field, e) {
		var data = this.state.data;
		
		data[index][field] = e.target.value;
		
		this.setState({ data: data });
	},
	render: function () {
		
		var ingredients = this.state.data.map(function(ingredient, index) { 
		
			var measures = this.props.measures.map(function (measure, index) {
				return <option value={index} key={index}>{measure.full}</option>;
			}, this);
		
			return <div className="ingredient">
				<input type="text" value={ingredient.quantity} onChange={this.updateField.bind(this, index, 'quantity')} placeholder="Quantity" />
				<div className="select-wrap">
					<select value={ingredient.measure} onChange={this.updateField.bind(this, index, 'measure')}>
						<option value="-1"></option>
						{measures}
					</select>
				</div>
				<input type="text" value={ingredient.name} onChange={this.updateField.bind(this, index, 'name')} placeholder="Name" />
				<input type="text" value={ingredient.preparation} onChange={this.updateField.bind(this, index, 'preparation')} placeholder="Preparation" />
				<div className="delete" onClick={this.removeItem.bind(this, index)}>&times;</div>
			</div>;
		}, this);
	
		return <div>
			{ingredients}
			<div className="add-ingredient" onClick={this.addItem}>Add</div>
			<input type="hidden" name="ingredients" value={this.encodeJson()} />
		</div>;
	}
});

$(document).ready(function () {
	$('[data-ingredients]').each(function () {
		var data = $(this).attr('data-ingredients') || '[{}]';
		React.render(<IngredientEditor data={data} measures={measures} />, this);
	});
});