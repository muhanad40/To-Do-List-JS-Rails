$(document).ready(function() {

	var ToDo = function() {}

	// Refresh the state of the "Clear complete (#) button"
	ToDo.prototype.refreshClearBtn = function() {
		var total_incomplete = todo.count_by('status', 'complete');
		var text = "Clear completed (" + total_incomplete + ")";
		$("#clear-completed").hide();
		if(total_incomplete)
			$("#clear-completed").show().html(text);
	}

	ToDo.prototype.refresh_item = function(id) {
		refresh_data(function(){
			var item_data = {tasksList: [find_item(id)]};
			var item_template = $("#tasks-list-template").html();
			var item_html = _.template(item_template, item_data);
			item_html = $(item_html).find('li').html();
			$('ul li#'+id).html(item_html);
			todo.refresh_count();
		});
	}

	ToDo.prototype.update_item = function(id, type, value) {
		$.ajax({
			type: 'PATCH',
			url: '/task/' + id,
			data: type + '=' + value,
			dataType: 'json'
		}).done(function(){
			find_item(id)[type] = value;
			todo.refresh_count();
			todo.refreshClearBtn();
		}).fail(function() {
			alert('Something went wrong');
		});

	}

	ToDo.prototype.refresh_data = function(callback) {
		callback = callback || function(){};
		$.ajax({
			type: 'GET',
			url: '/tasks',
			dataType: 'json'
		}).done(function(response_data){
			data.tasksList = response_data;
			callback();
		}).fail(function() {
			alert('Something went wrong');
		});
	}

	ToDo.prototype.getMaxOfArray = function(numArray) {
		return Math.max.apply(null, numArray);
	}

	ToDo.prototype.update_item_status_html = function(id, status) {
		$("ul li#"+id).attr('class', status);
	}

	ToDo.prototype.add_item = function(item) {
		item.order = todo.getLastItem().order + 1 || 1
		todo.show_loading();
		$.ajax({
			type: 'POST',
			url: '/task',
			data: item,
			dataType: 'json'
		}).done(function(response){
			data.tasksList.push(response);
			todo.add_item_to_list(response);
			todo.refresh_count();
			todo.hide_loading();
		});
	}

	ToDo.prototype.getLastItem = function(){
		return data.tasksList[data.tasksList.length - 1] || {}
	}

	ToDo.prototype.show_loading = function() {
		$('#temp-msg').fadeIn(100).show();
	}

	ToDo.prototype.hide_loading = function() {
		$('#temp-msg').fadeOut(100).hide();
	}

	ToDo.prototype.add_item_to_list = function(item_obj) {
		var item_data = { tasksList: [
			item_obj
		]};
		var item_template = $("#tasks-list-template").html();
		var item_template = _.template(item_template, item_data);
		var item_html = $(item_template).find('li')[0].outerHTML;
		$(item_html).appendTo('#all-tasks-list ul').hide().fadeIn();
	}

	ToDo.prototype.remove_item = function(id) {
		var item_obj = find_item(id);
		$.ajax({
			type: 'DELETE',
			url: '/task/' + id,
			dataType: 'json'
		}).done(function() {
			data.tasksList = _.without(data.tasksList, item_obj);
			todo.remove_item_from_list(id);
			todo.refresh_count();
			todo.refreshClearBtn();
		}).fail(function() {
			alert("Something went wrong!");
		});
	}

	ToDo.prototype.remove_item_from_list = function(id) {
		$('ul#tasks-list li#'+id).fadeOut('fast', function() {
			this.remove();
		});
	}

	ToDo.prototype.count_by = function(filter, value) {
		var task_count = 0;
		for (var i = 0; i < data.tasksList.length; i++) {
			if (data.tasksList[i][filter] == value) {
				task_count++;
			}
		}
		return task_count;
	}

	ToDo.prototype.refresh_count = function() {
		var total_incomplete = todo.count_by('status', 'incomplete');
		var text = total_incomplete.toString();
		text = text + " " + (total_incomplete == 0 || total_incomplete > 1 ? "tasks" : "task");
		text = text + " left";
		$("#tasks-left").html(text);
	}

	ToDo.prototype.find_item = function(id) {
		for (var i = 0; i < data.tasksList.length; i++) {
			if (data.tasksList[i]['id'] == id) {
				return data.tasksList[i];
				break;
			}
		}
	} 

	ToDo.prototype.generate_id = function() {
		var new_id = todo.getMaxOfArray($.map(data.tasksList, function(task){
			return parseInt(task.id);
		})) + 1;
		return new_id;
	}

	todo = new ToDo();

	_.templateSettings = {
		interpolate: /\#\#\=(.+?)\#\#/g,
		evaluate: /\#\#(.+?)\#\#/g
	};

	// Refresh the total tasks left counter
	todo.refresh_count();

	todo.refreshClearBtn();

	// Render the list
	var list_html = _.template($("#tasks-list-template").html(), data);
	$('#all-tasks-list').html(list_html);

	$( "#tasks-list" ).sortable({
		items: "> li",
		cursor: "move",
		handle: '.drag-handle',
		stop: function() {
			var items_order = $(this).sortable('toArray');
			$.ajax({
				type: 'PATCH',
				url: '/tasks/reorder',
				data: 'item_ids=' + JSON.stringify(items_order),
				dataType: 'json'
			});
		}
	});

	// Add task
	$('#task-form input#add-btn').on('click', function(event){
		event.preventDefault();
		var task = {
			id: todo.generate_id(),
			task: $('#task-input').val(),
			status: 'incomplete'
		};
		if(task.task !== '') {
			todo.add_item(task);
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
	$('#all-tasks-list').on('click', '#tasks-list .item-remove', function() {
		var task_id = $(this).parent().attr('id');
		todo.remove_item(task_id);
	});

	// Mark as complete/incomplete
	$("#all-tasks-list").on('change', '#tasks-list li .item-checkbox input', function() {
		var task_id = $(this).closest('li').attr('id');
		var checked = $(this).prop('checked');
		var update_status = (checked===true) ? 'complete' : 'incomplete'

		update_item(task_id, 'status', update_status);
		update_item_status_html(task_id, update_status);
	});

	// Clear completed tasks
	$("#clear-completed").on('click', function() {
		_.each(data.tasksList, function(item_obj) {
			if(item_obj.status === 'complete') {
				todo.remove_item(item_obj.id);
				todo.remove_item_from_list(item_obj.id);
			}
		});
		todo.refreshClearBtn();
	});
	
});