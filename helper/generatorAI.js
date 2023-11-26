import axios  from "axios";

const generator = async (totalMarks,easyP,medP,hardP) => {

  const options = {
    method: "POST",
    url: process.env.COHERE_URL,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${process.env.COHERE_API_KEY}`, 
    },
    data: {
      truncate: "END",
      return_likelihoods: "NONE",
      prompt: `Generate a structured JSON array of questions totaling ${totalMarks} marks for subject Physics,Chemistry or Biology. The questions should be distributed according to difficulty with ${easyP}% Easy, ${medP}% Medium, and ${hardP}% Hard. Each Easy question is worth 1 mark, Medium is worth 2 marks, and Hard is worth 3 marks. Format the output as a pure JSON array:

      [
          {
            'question': 'Question text here',
            'subject': 'Subject here',
            'topic': 'Topic here',
            'difficulty': 'Easy/Medium/Hard',
            'marks': 1/2/3
          },
          ...
      ]   
      `,
    },
  };

  let data;

  await axios
    .request(options)
    .then(function (response) {
        const generatedText = response.data.generations[0].text;
        // console.log("**********************generatedText",generatedText);
        let jsonMatch = generatedText.match(/```json([\s\S]*?)```/);
        // console.log("********************************jsomMatch",jsonMatch);
        if (jsonMatch && jsonMatch[1]) {
            try {
                const jsonStr = jsonMatch[1].trim();
                const generatedObj = JSON.parse(jsonStr);
                // console.log("********************************genetaedOBJ",generatedObj);
                // console.log(generatedObj);
                data = generatedObj;
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return "Error parsing JSON"
            }
        } else {
            console.error('No JSON found in the response');
            return "No JSON found in the response";
        }
    })
    .catch(function (error) {
      console.error(error);
    });
    return data;
};
export default generator;
