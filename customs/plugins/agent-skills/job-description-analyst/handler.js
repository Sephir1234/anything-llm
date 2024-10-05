const fs = require('fs');
const { pipeline } = require('transformers');

// Load a pre-trained model for Named Entity Recognition (NER) from Hugging Face
const nerModel = pipeline('ner', { model: 'dbmdz/bert-large-cased-finetuned-conll03-english' });

module.exports.runtime = {
  handler: async function ({ job_description }) {
    const agentId = `${this.config.name}-v${this.config.version}`;
    try {
      // Log start of analysis
      this.introspect(`Analyzing job description dynamically: ${job_description}`);
      this.logger(`${agentId} started analysis for: ${job_description}`);

      // Step 1: Read the job description file
      const jobDescriptionText = fs.readFileSync(job_description, 'utf-8');
      this.introspect(`Read job description file successfully`);

      // Step 2: Dynamically analyze the job description using the NER model
      const categories = await this._analyzeJobDescription(jobDescriptionText);

      // Step 3: Return the analysis result as a JSON string
      const result = JSON.stringify(categories);
      this.logger(`${agentId} completed job description analysis`);
      return result;

    } catch (error) {
      // Log error and return error message
      this.logger(`${agentId} failed: ${error.message}`);
      this.introspect(`Error during job description analysis: ${error.message}`);
      return `Error: ${error.message}`;
    }
  },

  // Helper function: Analyze job description using Hugging Face NER model
  _analyzeJobDescription: async function(description) {
    // Perform Named Entity Recognition (NER) on the job description
    const nerResults = await nerModel(description);

    // Extract skills, experience, and education dynamically based on recognized entities
    const skills = this._extractEntities(nerResults, ['SKILL']);
    const experience = this._extractEntities(nerResults, ['EXPERIENCE']);
    const education = this._extractEntities(nerResults, ['EDUCATION']);

    return {
      technicalSkills: skills.length ? skills : ['Technical skills not specified'],
      experience: experience.length ? experience : ['Experience not specified'],
      education: education.length ? education : ['Education not specified'],
    };
  },

  // Helper function: Extract entities from NER results based on entity types
  _extractEntities(nerResults, entityTypes) {
    return nerResults
      .filter(entity => entityTypes.includes(entity.entity))
      .map(entity => entity.word);
  }
};
