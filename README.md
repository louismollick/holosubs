# Holosubs

https://holosubs.netlify.app/

This is a proof of concept for a feature suggestion for [HoloTools](https://hololive.jetri.co/#/).  
Actually, I was planning to finish this project and manage it myself. However, the free-tier Youtube API Quota limit put some limits on how many queries I could do in an automatic manner. Additionally, the recent video purge has made many videos unaccessable via the Youtube API (because they're deleted or privated). This makes it hard for me to find the translated clips corresponding to the purged videos.  
But! Holotools seems to have saved (?) all the video ids from the deleted videos as well! And new videos seem to already be added to its database!
This is only a suggestion, the rest is up to you!

Concept :
Automatically aggregate the translated clips of Hololive members, such that they can be more easily found and searched for.
The proof of concept in the link above was limited to finding the translated clips corresponding to the most recent 50 videos (~ my daily api limit) from 3 vtubers (Coco, Kanata <3, Korone). It also only 
However we can imagine an automatic system which periodically searches for new translated clips of previous livestreams and adds them to the database.

How it works :
This feature relies on the fact that most translated clips have the source livestream link in their description.
So, if we make a youtube search for https://www.youtube.com/watch?v=XXXXXX with XXXXXX being the video id of a hololive member's past-broadcast, we recieve all videos that have that link in their description.
Then we then have to filter out the non-English clips (just simple regex), and we're left with mostly English translated 
clips. There are some errors sometimes, like clips which are not translated in English or random videos that are not Hololive related ; but in 90% of cases it works as intended.

How it can be improved :
- In the POC above, if you go to the "Sources" tab, clicking on a Source video will just open that video in Youtube. However, the goal was for it to list all the translated clips associated with it.
- The filtering for non-English clips can mess up sometimes, since it relies only on Regex. Initially, I tried using the Google Translate API to find the exact language of the title for each translated clip -- however it did not work very well. Maybe some kind of hybrid approach is possible? 

Thank you for reading, and thank you for all your hard work on Holotools!
