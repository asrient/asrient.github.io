import githubToProjects from './github.mjs';
import notionToBlogs from './notion.mjs';

(() => {
    console.log('<===========Downloading Files==============>');
    const tasks = [
        githubToProjects(),
        notionToBlogs(),
    ]
    Promise.all(tasks).catch((e) => {
        console.error('<===========Step Failed==============>')
        console.error(e);
    }).finally(() => {
        console.log('<===========Download Completed==============>')
    })
})();
