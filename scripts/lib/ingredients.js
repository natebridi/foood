
var IngredientEditor = React.createClass({
	displayName: "IngredientEditor",

	getInitialState: function () {
		return {
			data: JSON.parse(decodeHtml(this.props.data))
		};
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

		var ingredients = this.state.data.map(function (ingredient, index) {

			var measures = this.props.measures.map(function (measure, index) {
				return React.createElement(
					"option",
					{ value: index, key: index },
					measure.full
				);
			}, this);

			return React.createElement(
				"div",
				{ className: "ingredient" },
				React.createElement("input", { type: "text", value: ingredient.quantity, onChange: this.updateField.bind(this, index, 'quantity'), placeholder: "Quantity" }),
				React.createElement(
					"div",
					{ className: "select-wrap" },
					React.createElement(
						"select",
						{ value: ingredient.measure, onChange: this.updateField.bind(this, index, 'measure') },
						React.createElement("option", { value: "-1" }),
						measures
					)
				),
				React.createElement("input", { type: "text", value: ingredient.name, onChange: this.updateField.bind(this, index, 'name'), placeholder: "Name" }),
				React.createElement("input", { type: "text", value: ingredient.preparation, onChange: this.updateField.bind(this, index, 'preparation'), placeholder: "Preparation" }),
				React.createElement(
					"div",
					{ className: "delete", onClick: this.removeItem.bind(this, index) },
					"×"
				)
			);
		}, this);

		return React.createElement(
			"div",
			null,
			ingredients,
			React.createElement(
				"div",
				{ className: "add-ingredient", onClick: this.addItem },
				"Add"
			),
			React.createElement("input", { type: "hidden", name: "ingredients", value: this.encodeJson() })
		);
	}
});

$(document).ready(function () {
	$('[data-ingredients]').each(function () {
		var data = $(this).attr('data-ingredients') || '[{}]';
		React.render(React.createElement(IngredientEditor, { data: data, measures: measures }), this);
	});
});