export function extractCreatorData(emojiData){
	creatorData = []
	emojiData.forEach(function(emoji){
		creatorIndex=creatorData.findIndex(creator=>creator.name===emoji.user_display_name)
		if(creatorIndex===-1){
			creatorArray.push({name: emoji.user_display_name, count: 1})
		}
		else{
			creatorArray[creatorIndex].count++;
		}
	})
}
