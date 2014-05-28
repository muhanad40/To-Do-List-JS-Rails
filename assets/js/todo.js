$(document).ready(function() {

	_.templateSettings = {
		interpolate: /\#\#\=(.+?)\#\#/g,
		evaluate: /\#\#(.+?)\#\#/g
	};

	var data = { tasksList: [
		{'id': '9', 'status': 'incomplete', 'task': 'Do something today...'}
	]};

	// Refresh the total tasks left counter
	refresh_count();

	refresh_clear_btn();

	// Render the list
	var list_html = _.template($("#tasks-list-template").html(), data);
	$('#all-tasks-list').html(list_html);

	$( "#tasks-list" ).sortable({
		items: "> li",
		cursor: "move",
		handle: '.drag-handle',
		stop: function() {
			var items_order = $(this).sortable('toArray');
		}
	});

	// Add task
	$('#task-form input#add-btn').on('click', function(event){
		event.preventDefault();
		var task = {
			id: generate_id(),
			task: $('#task-input').val(),
			status: 'incomplete'
		};
		if(task.task !== '') {
			add_item(task);
			$('#task-form #task-input').val('');
		}
	});

	// Edit task
	$("#all-tasks-list").on("dblclick", '#tasks-list li .task', function() {
		item_id = $(this).parent().attr('id');
		var text = $.trim($(this).text());
		var task = $(this).parent();
		task.html("<input type='text' class='task-edit' value='" + text + "'>");
		task.find('input:text').focus();
	});

	$("#all-tasks-list").on("keydown", '#tasks-list li input.task-edit', function(e) {
		if(e.which == '13')
		{
			var task_text = $(this).val();
			if(task_text !== '')
			{
				var id = $(this).parent().attr('id');
				update_item(id, 'task', task_text);
			}
			refresh_item(id);
		}
	});

	$("#all-tasks-list").on("blur", '#tasks-list li input.task-edit', function() {
		var task_text = $(this).val();
		if(task_text !== '')
		{
			var id = $(this).parent().attr('id');
			update_item(id, 'task', task_text);
		}
		refresh_item(id);
	});

	// Remove task
	$('#all-tasks-list').on('click', '#tasks-list .item-remove', function(){
		var task_id = $(this).parent().attr('id');
		remove_item(task_id);
		remove_item_from_list(task_id);
		refresh_clear_btn();
	});

	// Mark as complete/incomplete
	$("#all-tasks-list").on('change', '#tasks-list li .item-checkbox input', function(){
		var task_id = $(this).closest('li').attr('id');
		var checked = $(this).prop('checked');
		var update_status = (checked===true) ? 'complete' : 'incomplete'

		update_item(task_id, 'status', update_status);
		update_item_status_html(task_id, update_status);
		refresh_clear_btn();
	});

	// Clear completed tasks
	$("#clear-completed").on('click', function() {
		_.each(data.tasksList, function(item_obj) {
			if(item_obj.status === 'complete') {
				remove_item(item_obj.id);
				remove_item_from_list(item_obj.id);
			}
		});
		refresh_clear_btn();
	});

	// Refresh the state of the "Clear complete (#) button"
	function refresh_clear_btn() {
		var total_incomplete = count_by('status', 'complete');
		var text = "Clear completed (" + total_incomplete + ")";
		$("#clear-completed").hide();
		if(total_incomplete)
			$("#clear-completed").show().html(text);
	}

	function refresh_item(id) {
		var item_data = {tasksList: [find_item(id)]};
		var item_template = $("#tasks-list-template").html();
		var item_html = _.template(item_template, item_data);
		item_html = $(item_html).find('li').html();
		$('ul li#'+id).html(item_html);
		refresh_count();
	}

	function update_item(id, type, value) {
		var item_obj = find_item(id);
		item_obj[type] = value;
		refresh_count();
	}

	function getMaxOfArray(numArray) {
		return Math.max.apply(null, numArray);
	}

	function update_item_status_html(id, status) {
		$("ul li#"+id).attr('class', status);
	}

	function add_item(item) {
		var item_obj = {
			'id': item.id,
			'status': item.status,
			'task': item.task
		};
		data.tasksList.push(item_obj);
		add_item_to_list(item_obj);
		refresh_count();
	}

	function add_item_to_list(item_obj) {
		var item_data = { tasksList: [
			item_obj
		]};
		var item_template = $("#tasks-list-template").html();
		var item_template = _.template(item_template, item_data);
		var item_html = $(item_template).find('li')[0].outerHTML;
		$(item_html).appendTo('#all-tasks-list ul').hide().fadeIn();
	}

	function remove_item(id) {
		var item_obj = find_item(id);
		data.tasksList = _.without(data.tasksList, item_obj);
		refresh_count();
	}

	function remove_item_from_list(id) {
		$('ul#tasks-list li#'+id).remove();
	}

	function count_by(filter, value) {
		var task_count = 0;
		for (var i = 0; i < data.tasksList.length; i++) {
			if (data.tasksList[i][filter] == value) {
				task_count++;
			}
		}
		return task_count;
	}

	function refresh_count() {
		var total_incomplete = count_by('status', 'incomplete');
		var text = total_incomplete.toString();
		text = text + " " + (total_incomplete == 0 || total_incomplete > 1 ? "tasks" : "task");
		text = text + " left";
		$("#tasks-left").html(text);
	}

	function find_item(id) {
		for (var i = 0; i < data.tasksList.length; i++) {
			if (data.tasksList[i]['id'] == id) {
				return data.tasksList[i];
				break;
			}
		}
	} 

	function generate_id() {
		var new_id = getMaxOfArray($.map(data.tasksList, function(task){
			return parseInt(task.id);
		})) + 1;
		return new_id;
	}
	
});