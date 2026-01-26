const mongoose = require('mongoose');
const Question = require('./models/Question'); 
require('dotenv').config(); 

// 1. YOUR PRACTICE DATA
const practiceData = [
  {
    "title": "Two Sum - Unsorted",
    "link": "https://leetcode.com/problems/two-sum/",
    "ansLink": "",
    "topic": "Two Sum"
  },
  {
    "title": "Two Sum - Sorted (IB)",
    "link": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    "ansLink": "",
    "topic": "Two Sum"
  },
  {
    "title": "Two Sum - Closest",
    "link": "https://www.geeksforgeeks.org/given-sorted-array-number-x-find-pair-array-whose-sum-closest-x/",
    "ansLink": "",
    "topic": "Two Sum"
  },
  {
    "title": "Target Sum Pairs - Unique",
    "link": "https://leetcode.com/problems/two-sum/",
    "ansLink": "",
    "topic": "Two Sum"
  },
  {
    "title": "Count Pairs <= K Sum",
    "link": "https://www.geeksforgeeks.org/count-pairs-array-whose-sum-less-x/",
    "ansLink": "",
    "topic": "Two Sum"
  },
  {
    "title": "Two Sum - Design",
    "link": "https://leetcode.com/problems/two-sum-iii-data-structure-design/",
    "ansLink": "",
    "topic": "Two Sum"
  },
  {
    "title": "Two Sum - Absolute Sorted",
    "link": "https://www.geeksforgeeks.org/count-pairs-difference-equal-k/",
    "ansLink": "",
    "topic": "Two Sum"
  },
  {
    "title": "Target Difference Pair",
    "link": "https://leetcode.com/problems/k-diff-pairs-in-an-array/",
    "ansLink": "",
    "topic": "Difference Pair"
  },
  {
    "title": "K Difference Pairs",
    "link": "https://leetcode.com/problems/k-diff-pairs-in-an-array/",
    "ansLink": "",
    "topic": "Difference Pair"
  },
  {
    "title": "Longest Diff Pair (IB)",
    "link": "https://www.interviewbit.com/problems/pair-with-given-difference/",
    "ansLink": "",
    "topic": "Difference Pair"
  },
  {
    "title": "3 Sum",
    "link": "https://leetcode.com/problems/3sum/",
    "ansLink": "",
    "topic": "Three Sum"
  },
  {
    "title": "3 Sum - Smaller",
    "link": "https://leetcode.com/problems/3sum-smaller/",
    "ansLink": "",
    "topic": "Three Sum"
  },
  {
    "title": "3 Sum - Closest",
    "link": "https://leetcode.com/problems/3sum-closest/",
    "ansLink": "",
    "topic": "Three Sum"
  },
  {
    "title": "Count Valid Triplets",
    "link": "https://leetcode.com/problems/valid-triangle-number/",
    "ansLink": "",
    "topic": "Three Sum"
  },
  {
    "title": "Max Sum Triplet",
    "link": "https://www.geeksforgeeks.org/maximum-sum-triplet-array-j-k-ai-aj-ak/",
    "ansLink": "",
    "topic": "Three Sum"
  },
  {
    "title": "Minimize Differences (Arrays)",
    "link": "https://www.geeksforgeeks.org/minimize-the-maximum-difference-between-the-heights/",
    "ansLink": "",
    "topic": "Three Sum"
  },
  {
    "title": "4 Sum",
    "link": "https://leetcode.com/problems/4sum/",
    "ansLink": "",
    "topic": "Four Sum"
  },
  {
    "title": "4 Sum - II",
    "link": "https://leetcode.com/problems/4sum-ii/",
    "ansLink": "",
    "topic": "Four Sum"
  },
  {
    "title": "Tuples - Equal Product",
    "link": "https://leetcode.com/problems/tuple-with-same-product/",
    "ansLink": "",
    "topic": "Four Sum"
  },
  {
    "title": "Max Sum Subarray of Size K",
    "link": "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Distinct Nos in Every Window",
    "link": "https://www.geeksforgeeks.org/problems/count-distinct-elements-in-every-window/1",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Min Swaps K Together",
    "link": "https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together/",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "First Negative in Sliding Window",
    "link": "https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Check Anagram Substring",
    "link": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Substring with Concatenations",
    "link": "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Equivalent Subarrays",
    "link": "https://leetcode.com/problems/count-complete-subarrays-in-an-array/",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Sliding Window Maximum",
    "link": "https://leetcode.com/problems/sliding-window-maximum/",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Max Consecutive Ones III",
    "link": "https://leetcode.com/problems/max-consecutive-ones-iii/",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Minimum Window Substring",
    "link": "https://leetcode.com/problems/minimum-window-substring/",
    "ansLink": "",
    "topic": "Sliding Window Technique"
  },
  {
    "title": "Longest Substring w/o Repeating Char",
    "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "ansLink": "",
    "topic": "Substring - Repeating Char"
  },
  {
    "title": "Longest Substring - At Most K Unique",
    "link": "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
    "ansLink": "",
    "topic": "Substring - Repeating Char"
  },
  {
    "title": "Longest Substring - At Least K Repeating",
    "link": "https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/",
    "ansLink": "",
    "topic": "Substring - Repeating Char"
  },
  {
    "title": "Count Subarrays with K Odds",
    "link": "https://leetcode.com/problems/count-number-of-nice-subarrays/",
    "ansLink": "",
    "topic": "Substring - Repeating Char"
  },
  {
    "title": "Longest Repeating Character Replacement",
    "link": "https://leetcode.com/problems/longest-repeating-character-replacement/",
    "ansLink": "",
    "topic": "Substring - Repeating Char"
  },
  {
    "title": "Smallest Subarray with Sum >= X",
    "link": "https://leetcode.com/problems/minimum-size-subarray-sum/",
    "ansLink": "",
    "topic": "Subarray with Restriction"
  },
  {
    "title": "Count Subarrays with Product < X",
    "link": "https://leetcode.com/problems/subarray-product-less-than-k/",
    "ansLink": "",
    "topic": "Subarray with Restriction"
  },
  {
    "title": "Count Subarrays with Max in Range",
    "link": "https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/",
    "ansLink": "",
    "topic": "Subarray with Restriction"
  },
  {
    "title": "Trapping Rain Water",
    "link": "https://leetcode.com/problems/trapping-rain-water/",
    "ansLink": "",
    "topic": "Trapping Rain Water"
  },
  {
    "title": "Container With Most Water",
    "link": "https://leetcode.com/problems/container-with-most-water/",
    "ansLink": "",
    "topic": "Trapping Rain Water"
  },
  {
    "title": "Boats to Save People",
    "link": "https://leetcode.com/problems/boats-to-save-people/",
    "ansLink": "",
    "topic": "Trapping Rain Water"
  },
  {
    "title": "Min String Deleting Ends",
    "link": "https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/",
    "ansLink": "",
    "topic": "Trapping Rain Water"
  },
  {
    "title": "Distinct Absolute Array Elements",
    "link": "https://www.geeksforgeeks.org/count-distinct-absolute-values-sorted-array/",
    "ansLink": "",
    "topic": "Trapping Rain Water"
  }
];

// 2. CONNECT AND SEED
const seedPractice = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to Database...");

        // Prepare data with correct flags
        const formattedData = practiceData.map(q => ({
            ...q,
            isPractice: true, // Force Practice Mode
            dateTaught: new Date() // Set today's date so they don't break sorting
        }));

        // Insert new data (Append to existing)
        await Question.insertMany(formattedData);
        console.log(`🚀 Successfully added ${formattedData.length} PRACTICE questions!`);

        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedPractice();