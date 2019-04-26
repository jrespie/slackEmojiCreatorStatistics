(async () => {
    try {
		result = await fetchCustomEmojiInformation(1);
		totalEmojicount = result.custom_emoji_total_count;

		result = await fetchCustomEmojiInformation(totalEmojicount);
		emojiData = result.emoji;

		creatorData = extractCreatorData(emojiData);

		creatorData.sort((a,b) => (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0));

		generateFullContentAndAddToPage(creatorData);

		console.log(creatorData);
		} catch (e) {
			console.log("Error: "+e);
		}
})();

function getSlackApiToken () {
	const scripts = document.querySelectorAll('script[type="text/javascript"]');
	var apiToken;

	scripts.forEach((script) => {

		const apiTokenResult = /["]?api_token["]?\:\s*\"(.+?)\"/g.exec(script.innerText);
		if (apiTokenResult) {
			apiToken = apiTokenResult[1];
		}
	});
	return apiToken;
}

async function fetchCustomEmojiInformation(count) {
	response = await fetch("https://pushpay.slack.com/api/emoji.adminList", {
		"credentials":
			"include",
			"headers":{
				"accept":"*/*",
				"accept-language":"en-US,en;q=0.9",
				"content-type":"multipart/form-data; boundary=----WebKitFormBoundaryRlh1AgrFpnxFfVUb"
			},
			"referrerPolicy":"no-referrer",
			"body":`------WebKitFormBoundaryRlh1AgrFpnxFfVUb\r\nContent-Disposition: form-data; name=\"query\"\r\n\r\n\r\n------WebKitFormBoundaryRlh1AgrFpnxFfVUb\r\nContent-Disposition: form-data; name=\"page\"\r\n\r\n1\r\n------WebKitFormBoundaryRlh1AgrFpnxFfVUb\r\nContent-Disposition: form-data;name=\"count\"\r\n\r\n${count}\r\n------WebKitFormBoundaryRlh1AgrFpnxFfVUb\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n${getSlackApiToken()}\r\n------WebKitFormBoundaryRlh1AgrFpnxFfVUb\r\nContent-Disposition: form-data; name=\"_x_mode\"\r\n\r\nonline\r\n------WebKitFormBoundaryRlh1AgrFpnxFfVUb--\r\n`,
			"method":"POST",
			"mode":"cors"});
return response.json();
}

function extractCreatorData(emojiData){
	creatorData = []
	emojiData.forEach(function(emoji){
		creatorIndex=creatorData.findIndex(creator=>creator.name===emoji.user_display_name)
		if(creatorIndex===-1){
			creatorData.push({name: emoji.user_display_name, count: 1})
		}
		else{
			creatorData[creatorIndex].count++;
		}
	})
	return creatorData;
}

function generateHTMLTableOfCreatorStats(creatorData){
	const HTMLTableOfCreatorStats = document.createElement('div');
	creatorData.forEach(function(creator,index){
		HTMLTableOfCreatorStats.innerHTML+=`
		<div class="c-virtual_list__item" role="presentation" style="top: ${index*65}px;" tabindex="-1">
			<div role="presentation" class="c-table_view_row_container">
				<div role="row" class="c-table_view_flexbox c-table_view_row p-customize_emoji_list__row">
					<div role='gridcell' class='c-table_view_row_item'>${creator.name}
					</div>
					<div role='gridcell' class='c-table_view_row_item'>${creator.count}
					</div>
				</div>
			</div>
		</div>`
	});
	return HTMLTableOfCreatorStats.innerHTML;
}

function generateFullContentAndAddToPage(creatorData){
	const customizeEmojiWrapperElement = document.querySelector('.p-customize_emoji_wrapper');
	const formattedCreatorDataTable = document.createElement('div');

	formattedCreatorDataTable.innerHTML=`
	<h4 class="large_bottom_margin inline_block black">${creatorData.length} people have added custom emoji</h4>
	<div class="c-table_view_container">
		<div role="grid" class="c-table_view_keyboard_navigable_container">
			<div role="rowgroup" class="c-table_view_flexbox_container">
				<div role="row" class="c-table_view_flexbox c-table_view_row_header">
					<div role="columnheader" tabindex="-1" class="c-table_view_header_item c-table_view_hover_disabled p-customize_emoji_list__header">
						<span class="c-table_view_header_item_value">Emoji Creator</span>
					</div>
					<div role="columnheader" tabindex="-1" class="c-table_view_header_item c-table_view_hover_disabled p-customize_emoji_list__header">
						<span class="c-table_view_header_item_value">Emojis created</span>
					</div>
				</div>
				<div role="presentation" class="c-table_view_all_rows_container" style="height: 200px;">
					<div style="overflow: visible; height: 0px; width: 0px;" role="presentation">
						<div role="presentation">
							<div tabindex="0" style="position: absolute; width: 1px; height: 1px; outline: none; box-shadow: none;">
							</div>
						<div role="presentation" class="c-virtual_list c-virtual_list--scrollbar c-scrollbar" style="width: 894px; height: 200px;">
							<div role="presentation" class="c-scrollbar__hider">
								<div role="presentation" class="c-scrollbar__child" style="width: 894px;">
									<div class="c-virtual_list__scroll_container" role="presentation" style="position: relative; height: ${creatorData.length*65}px;">
										${generateHTMLTableOfCreatorStats(creatorData)}
									</div>
								</div>
							</div>
							<div role="presentation" class="c-scrollbar__track">
								<div role="presentation" class="c-scrollbar__bar" tabindex="-1" style="height: 50px; transform: translateY(0px);">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<br/>`;

	customizeEmojiWrapperElement.before(formattedCreatorDataTable);
}