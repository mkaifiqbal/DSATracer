const mongoose = require('mongoose');
const Question = require('./models/Question'); // Ensure path is correct
require('dotenv').config();

// 1. DATA WITH FIXED LINKS (I removed "description/" manually for you)
const questionsData = [
  {
    "title": "925. Long Pressed Name",
    "link": "https://leetcode.com/problems/long-pressed-name/",
    "isPractice": false
  },
  {
    "title": "169. Majority Element",
    "link": "https://leetcode.com/problems/majority-element/",
    "isPractice": false
  },
  {
    "title": "238. Product of Array Except Self",
    "link": "https://leetcode.com/problems/product-of-array-except-self/",
    "isPractice": false
  },
  {
    "title": "915. Partition Array into Disjoint Intervals",
    "link": "https://leetcode.com/problems/partition-array-into-disjoint-intervals/",
    "isPractice": false
  },
  {
    "title": "Max Sum Subarray of size K",
    "link": "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
    "isPractice": false
  },
  {
    "title": "209. Minimum Size Subarray Sum",
    "link": "https://leetcode.com/problems/minimum-size-subarray-sum/",
    "isPractice": false
  },
  {
    "title": "881. Boats to Save People",
    "link": "https://leetcode.com/problems/boats-to-save-people/",
    "isPractice": false
  },
  {
    "title": "713. Subarray Product Less Than K",
    "link": "https://leetcode.com/problems/subarray-product-less-than-k/",
    "isPractice": false
  },
  {
    "title": "1750. Minimum Length of String After Deleting Similar Ends",
    "link": "https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/",
    "isPractice": false
  },
  {
    "title": "Subarray with 0 sum",
    "link": "https://www.geeksforgeeks.org/problems/subarray-with-0-sum-1587115621/1",
    "isPractice": false
  },
  {
    "title": "475. Heaters",
    "link": "https://leetcode.com/problems/heaters/",
    "isPractice": false
  },
  {
    "title": "658. Find K Closest Elements",
    "link": "https://leetcode.com/problems/find-k-closest-elements/",
    "isPractice": false
  },
  {
    "title": "Find the closest number",
    "link": "https://www.geeksforgeeks.org/problems/find-the-closest-number5513/1",
    "isPractice": false
  },
  {
    "title": "367. Valid Perfect Square",
    "link": "https://leetcode.com/problems/valid-perfect-square/",
    "isPractice": false
  },
  {
    "title": "153. Find Minimum in Rotated Sorted Array",
    "link": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "isPractice": false
  },
  {
    "title": "154. Find Minimum in Rotated Sorted Array II",
    "link": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
    "isPractice": false
  },
  {
    "title": "74. Search a 2D Matrix",
    "link": "https://leetcode.com/problems/search-a-2d-matrix/",
    "isPractice": false
  },
  {
    "title": "33. Search in Rotated Sorted Array",
    "link": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    "isPractice": false
  },
  {
    "title": "852. Peak Index in a Mountain Array",
    "link": "https://leetcode.com/problems/peak-index-in-a-mountain-array/",
    "isPractice": false
  },
  {
    "title": "540. Single Element in a Sorted Array",
    "link": "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    "isPractice": false
  },
  {
    "title": "274. H-Index",
    "link": "https://leetcode.com/problems/h-index/",
    "isPractice": false
  },
  {
    "title": "Allocate Minimum Pages",
    "link": "https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1",
    "isPractice": false
  },
  {
    "title": "410. Split Array Largest Sum",
    "link": "https://leetcode.com/problems/split-array-largest-sum/",
    "isPractice": false
  },
  {
    "title": "The Painter's Partition Problem-II",
    "link": "https://www.geeksforgeeks.org/problems/the-painters-partition-problem1535/1",
    "isPractice": false
  },
  {
    "title": "1011. Capacity To Ship Packages Within D Days",
    "link": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
    "isPractice": false
  },
  {
    "title": "875. Koko Eating Bananas",
    "link": "https://leetcode.com/problems/koko-eating-bananas/",
    "isPractice": false
  },
  {
    "title": "Aggressive Cows",
    "link": "https://www.geeksforgeeks.org/problems/aggressive-cows/1",
    "isPractice": false
  }
];

const updateDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to Database...");

        let count = 0;

        // Loop through each question in the list
        for (const q of questionsData) {
            // Find by Title, Update the Link
            const result = await Question.updateOne(
                { title: q.title }, // Find matches by Title
                { $set: { link: q.link } } // Update ONLY the link
            );

            if (result.matchedCount > 0) {
                count++;
                console.log(`Updated: ${q.title}`);
            } else {
                console.log(`⚠️ Not Found: ${q.title} (Check spelling in DB)`);
            }
        }

        console.log(`\n🚀 Finished! Updated ${count} questions.`);
        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error("❌ Error updating:", error);
        process.exit(1);
    }
};

updateDB();