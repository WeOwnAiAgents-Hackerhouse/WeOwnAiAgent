# CursorRules for Building AI Agents

## Introduction
This document defines a set of rules for developing AI agents using modern tools and frameworks, drawing inspiration from Google Agentspace, Vertex AI Builder, and NotebookLM. These rules guide developers through the entire lifecycle of AI agent creation—from data preparation to deployment and monitoring—using a Next.js monorepo setup with Shadcn UI for the frontend and modular microservices for the backend.

## Rules

### Rule 1: User Workflow Pipeline
**Description:** This rule outlines the sequential steps for building and using AI agents, ensuring a structured process with potential iterations at each stage.

#### Stages:

1. **Data Preparation:**  
   - **Process:** Identify and collect data sources like documents, databases, or web content. Format data for compatibility with the chosen tools.  
   - **Tools and Inspiration:** Leverage connectors for Confluence or Google Drive (inspired by Google Agentspace). Support uploads of PDFs, Google Docs, or web URLs (NotebookLM).  
   - **Iterations:** Refine or re-upload data if formats don’t work. Expand sources based on agent performance.

2. **Agent Setup:**  
   - **Process:** Define the agent’s role, personality, and instructions. Link it to prepared data sources.  
   - **Tools and Inspiration:** Use Vertex AI Agent Builder for no-code or code-first setups. Explore pre-built agents like NotebookLM Plus (Agentspace).  
   - **Iterations:** Tweak instructions, switch templates, or adjust data links if the setup underperforms.

3. **Training or Fine-tuning:**  
   - **Process:** Train or fine-tune the agent with specific data to boost accuracy. Track progress with metrics.  
   - **Tools and Inspiration:** Use Vertex AI’s Retrieval Augmented Generation (RAG) and grounding capabilities. Synthesize insights with NotebookLM.  
   - **Iterations:** Run additional training if outputs are off. Adjust data or parameters as needed.

4. **Testing and Validation:**  
   - **Process:** Test the agent with sample queries or tasks. Validate responses for accuracy and relevance.  
   - **Tools and Inspiration:** Prototype with Vertex AI’s conversational tools. Query with citations using NotebookLM.  
   - **Iterations:** Test multiple times, refining based on results. Update settings or data if validation fails.

5. **Deployment:**  
   - **Process:** Deploy the agent via web interfaces or APIs. Configure access controls and integrations.  
   - **Tools and Inspiration:** Build a branded search agent with Agentspace. Scale deployments with Vertex AI.  
   - **Iterations:** Optimize settings like resource scaling or access rules post-deployment.

6. **Monitoring and Feedback:**  
   - **Process:** Monitor performance with dashboards. Gather user feedback for improvements.  
   - **Tools and Inspiration:** Use Agentspace’s analytics and suggestions. Enable sharing and analytics with NotebookLM Plus.  
   - **Iterations:** Update the agent based on feedback, retraining or revising instructions.

### Rule 2: Design with Next.js and Shadcn UI
**Description:** This rule details how to design the application frontend using a Next.js monorepo and Shadcn UI, tailored to each stage of the AI agent lifecycle.

#### Stages:

1. **Data Preparation:**  
   - **UI Components:**  
     - File uploader: `<FileUpload>`  
     - URL input: `<Input>`  
     - Submit button: `<Button>`  
     - Error alerts: `<Alert>`  
   - **Implementation:** Place in `@agent-app/pages/data`. Store components in `@agent-app/components/data`. Validate file types and sizes.

2. **Agent Setup:**  
   - **UI Components:**  
     - Wizard dialog: `<Dialog>`  
     - Role dropdown: `<Select>`  
     - Personality options: `<RadioGroup>`  
     - Instructions field: `<Textarea>`  
     - Template selector: `<Combobox>`  
   - **Implementation:** Host in `@agent-app/pages/agent-setup`. Use `@agent-app/components/agent` for components. Connect to APIs via Next.js routes.

3. **Training or Fine-tuning:**  
   - **UI Components:**  
     - Start button: `<Button>`  
     - Progress indicator: `<Progress>`  
     - Status card: `<Card>`  
   - **Implementation:** Build in `@agent-app/pages/training`. Use `@agent-app/components/training`. Add real-time updates with WebSockets or polling.

4. **Testing and Validation:**  
   - **UI Components:**  
     - Query input: `<Input>`  
     - Response area: `<Card>`  
     - Comparison table: `<Table>`  
     - Feedback form: `<Form>`, `<Rating>`  
   - **Implementation:** Organize in `@agent-app/pages/testing`. Use `@agent-app/components/testing`. Enable live response updates.

5. **Deployment:**  
   - **UI Components:**  
     - Deploy button: `<Button>`  
     - Access settings: `<Dialog>`  
     - Status notification: `<Toast>`  
   - **Implementation:** Place in `@agent-app/pages/deployment`. Use `@agent-app/components/deployment`. Secure with middleware.

6. **Monitoring and Feedback:**  
   - **UI Components:**  
     - Stats table: `<DataTable>`  
     - Performance charts: Recharts  
     - Feedback form: `<Form>`  
   - **Implementation:** Host in `@agent-app/pages/monitoring`. Use `@agent-app/components/monitoring`. Link to analytics services.

### Rule 3: Testing the Agent
**Description:** This rule specifies the UI components needed for testing the AI agent, ensuring effective interaction and validation.

#### Components:
- Text Input Field: `<Input>` for submitting queries or tasks.  
- Response Display Area: `<Card>` to present formatted agent responses.  
- Expected Answer Field: Optional `<Input>` or `<Textarea>` for comparison.  
- Feedback Mechanisms: `<Rating>` for scores, `<Form>` for comments.  
- Complex Workflow Controls: `<Button>` for sequence navigation, `<Chart>` for visualizations.  
- Error Handling: `<Alert>` for API errors or invalid inputs.

These components streamline testing and feedback collection.

### Rule 4: Microservices and Packages
**Description:** This rule defines the microservices and packages required for a modular architecture supporting multiple AI models and inference providers.

#### Services:
1. **Model Selection Service:**  
   - **Purpose:** Lists models (e.g., Gemini, OpenAI).  
   - **Implementation:** `@agent-app/services/model-selection`.

2. **Inference Service:**  
   - **Purpose:** Processes inference requests, unifying APIs.  
   - **Implementation:** `@agent-app/services/inference`.

3. **Data Management Service:**  
   - **Purpose:** Handles data sources (e.g., vector DBs).  
   - **Implementation:** `@agent-app/services/data`.

4. **Agent Configuration Service:**  
   - **Purpose:** Stores agent setups and links.  
   - **Implementation:** `@agent-app/services/agent-config`.

5. **Workflow Management Service:**  
   - **Purpose:** Coordinates task sequences.  
   - **Implementation:** `@agent-app/services/workflow`.

6. **Feedback and Monitoring Service:**  
   - **Purpose:** Tracks feedback and metrics.  
   - **Implementation:** `@agent-app/services/feedback`.

#### Packages:
- `@agent-app/core`: Core agent logic.  
- `@agent-app/models`: Interfaces for models and data.  
- `@agent-app/components`: Shadcn UI components.  
- `@agent-app/pages`: Next.js page modules.  
- `@agent-app/apis`: Model provider clients (e.g., `@agent-app/apis/openai`).

This setup ensures modularity and scalability.

## Conclusion
These rules provide a comprehensive framework for building AI agents. By following the workflow, design, and architecture guidelines, developers can create robust, user-friendly solutions that evolve with feedback and requirements.


## Grok output:


# Detailed Analysis and Implementation Notes

This section provides a comprehensive breakdown of the user workflow, design considerations, and technical architecture, inspired by Google's AgentSpace, Vertex AI Builder, and NotebookLM, as of February 28, 2025. It expands on the direct answer, offering a professional and detailed perspective for developers and architects.

## User Workflow Pipeline: Sequential Steps and Iterations

The user workflow for building and using AI agents involves a series of sequential steps with potential iterations at each stage. Below is a detailed breakdown:

### 1. Data Preparation

- **Process:** 
  - Users identify and collect relevant data sources, such as documents, databases, or web content. This step ensures the agent has access to the necessary information for grounding responses.

- **Tools and Inspiration:** 
  - Google Agentspace supports integration with enterprise data, including unstructured (e.g., documents, emails) and structured data (e.g., tables), with prebuilt connectors for applications like Confluence and Google Drive.
  - NotebookLM allows uploading various formats like PDFs, Google Docs, and web URLs, processing them for analysis.

- **Iterations:** 
  - Users may need to re-upload or refine data if initial formats are incompatible or add more sources based on agent performance needs. This could involve multiple rounds of data cleaning or reformatting.

### 2. Setting up the Agent

- **Process:** 
  - Users choose or create an agent, defining its role (e.g., research assistant, task automation), personality (e.g., formal, humorous), and specific instructions. The agent is then linked to the prepared data sources.

- **Tools and Inspiration:** 
  - Vertex AI Agent Builder offers no-code and code-first approaches, allowing users to design agents using natural language or frameworks like LangChain.
  - Agentspace provides pre-built agents like NotebookLM Plus, enhancing enterprise security and privacy.

- **Iterations:** 
  - Users may iterate by adjusting agent instructions, selecting different templates, or re-linking data sources if initial setups yield suboptimal results.

### 3. Training or Fine-tuning

- **Process:** 
  - Depending on the tool, users may train or fine-tune the agent using specific data to improve accuracy and relevance. This step is crucial for grounding responses in enterprise or user-specific data.

- **Tools and Inspiration:** 
  - Vertex AI supports Retrieval Augmented Generation (RAG) and grounding with enterprise data, simplifying the process without extensive coding.
  - NotebookLM synthesizes uploaded information to generate insights, with features like audio overviews for engagement.

- **Iterations:** 
  - Training may require multiple runs if initial outputs are inaccurate, with users adjusting data inputs or training parameters.

### 4. Testing and Validation

- **Process:** 
  - Users test the agent with sample queries or tasks, validating responses for accuracy and relevance. This stage ensures the agent meets user expectations before deployment.

- **Tools and Inspiration:** 
  - Vertex AI Agent Builder includes tools for rapid prototyping and experimentation, with conversational interfaces for testing.
  - NotebookLM allows users to ask questions and receive cited answers, facilitating validation.

- **Iterations:** 
  - Testing may involve multiple rounds of query inputs, comparing responses with expected outputs, and refining based on feedback.

### 5. Deployment

- **Process:** 
  - Once validated, the agent is deployed for user interaction, accessible via web interfaces or APIs, with settings for access control and integration.

- **Tools and Inspiration:** 
  - Agentspace offers a company-branded multimodal search agent for enterprise use, with deployment options across channels.
  - Vertex AI supports deployment for chatbots and search experiences, ensuring scalability.

- **Iterations:** 
  - Deployment may require adjustments for performance, such as scaling resources or updating access controls.

### 6. Monitoring and Feedback

- **Process:** 
  - Users monitor agent performance through dashboards, collecting feedback to iteratively improve functionality.

- **Tools and Inspiration:** 
  - Agentspace includes features for proactive suggestions and actions based on enterprise data, with potential for analytics.
  - NotebookLM Plus offers sharing options and analytics for enterprise users.

- **Iterations:** 
  - Feedback loops may lead to multiple rounds of updates, such as retraining with new data or adjusting agent instructions.

This pipeline is iterative, with feedback from later stages often looping back to earlier ones, ensuring adaptability and improvement.

## Next.js Monorepo Setup with Shadcn UI: Design for Each Stage

Using a Next.js monorepo setup with Shadcn UI, the application design for each lifecycle stage is detailed below, leveraging the component library for consistency and efficiency:

### 1. Data Preparation

- **Design:** 
  - Include a file uploader component using Shadcn UI's `<FileUpload>` for document uploads, and a form with `<Input>` fields for URL inputs. Integrate with data management systems via API calls, using `<Button>` for submission.

- **Implementation:** 
  - Organize in the `@agent-app/pages/data` package, with components in `@agent-app/components/data`. Ensure validation for file types and sizes, with error handling using Shadcn UI's `<Alert>`.

### 2. Setting up the Agent

- **Design:** 
  - Create a wizard using Shadcn UI's `<Dialog>` for agent setup, with steps for role selection (`<Select>`), personality (`<RadioGroup>`), and instructions (`<Textarea>`). Include template selection with `<Combobox>` for pre-built options.

- **Implementation:** 
  - Place in `@agent-app/pages/agent-setup`, with components in `@agent-app/components/agent`. Integrate with tool APIs using Next.js API routes, ensuring state management with React Context or Zustand.

### 3. Training or Fine-tuning

- **Design:** 
  - Add a section with a `<Button>` to initiate training, displaying progress with Shadcn UI's `<Progress>` bar. Include status updates in a `<Card>` component, showing training metrics.

- **Implementation:** 
  - Host in `@agent-app/pages/training`, with components in `@agent-app/components/training`. Use WebSockets or polling for real-time updates.

### 4. Testing and Validation

- **Design:** 
  - Include a query input field using `<Input>`, a response display area with `<Card>` for formatting, and a comparison tool with `<Table>` for expected vs. actual outputs. Add feedback forms with `<Form>` and `<Rating>` components.

- **Implementation:** 
  - Organize in `@agent-app/pages/testing`, with components in `@agent-app/components/testing`. Ensure real-time updates for responses, with error handling for API failures.

### 5. Deployment

- **Design:** 
  - Include a deploy button using `<Button>`, with settings for access control in a `<Dialog>` (e.g., user roles, permissions). Display deployment status in a `<Toast>` notification.

- **Implementation:** 
  - Place in `@agent-app/pages/deployment`, with components in `@agent-app/components/deployment`. Use Next.js middleware for authentication and authorization.

### 6. Monitoring and Feedback

- **Design:** 
  - Develop dashboards using Shadcn UI's `<DataTable>` for usage statistics, charts with libraries like Recharts for performance metrics, and feedback forms with `<Form>` for user input.

- **Implementation:** 
  - Host in `@agent-app/pages/monitoring`, with components in `@agent-app/components/monitoring`. Integrate with analytics services like Google Analytics, ensuring data privacy compliance.

This design leverages Next.js for server-side rendering and Shadcn UI for reusable, accessible components, ensuring a scalable and maintainable monorepo structure.

## UI Components for Testing the Agent: Necessary Workflows

For testing the agent, the UI must support user interaction and validation, with the following components:

- **Text Input Field:** 
  - Use `<Input>` for users to enter queries or tasks, with autocomplete suggestions if applicable.

- **Response Display Area:** 
  - Use `<Card>` to display agent responses, with formatting for readability (e.g., markdown rendering), and inline citations if available.

- **Expected Answer Field:** 
  - Optionally include another `<Input>` or `<Textarea>` for users to input expected answers, facilitating comparison, with a side-by-side view using `<Table>` for clarity.

- **Feedback Mechanisms:** 
  - Include `<Rating>` for user ratings (e.g., 1-5 stars) and `<Form>` for comments, with submit `<Button>`, ensuring feedback collection is seamless.

- **Complex Workflow Controls:** 
  - For advanced testing, include sequence controls with `<Button>` (e.g., "Next Step," "Pause"), and visualizations using `<Chart>` or flowcharts with libraries like React Flow.

- **Error Handling:** 
  - Use `<Alert>` for API errors or invalid inputs, ensuring user guidance during testing.

These components ensure users can effectively test and validate agent performance, with iterative feedback loops for refinement.

## Microservices and Packages for Multiple Model Providers

To support multiple AI models (e.g., Hugging Face, OpenAI, Gemini) and inference providers, including vector databases, the architecture requires modular microservices and packages. Below is a detailed breakdown:

### 1. Model Selection Service

- **Functionality:** 
  - Lists available models (e.g., Gemini, OpenAI, Hugging Face) and allows configuration (e.g., temperature, max tokens).

- **Implementation:** 
  - A REST API endpoint in `@agent-app/services/model-selection`, with a database table for model metadata, using ORM like Prisma for management.

### 2. Inference Service

- **Functionality:** 
  - Handles inference requests to selected models, abstracting API differences (e.g., OpenAI's chat completions vs. Gemini's streaming).

- **Implementation:** 
  - A microservice in `@agent-app/services/inference`, with adapters for each provider (e.g., `@agent-app/apis/openai`, `@agent-app/apis/gemini`), using gRPC for high performance.

### 3. Data Management Service

- **Functionality:** 
  - Manages data sources, supporting various stores like vector databases (e.g., Pinecone, Weaviate) and traditional databases.

- **Implementation:** 
  - A service in `@agent-app/services/data`, with connectors for different DBs in `@agent-app/apis/vector-db`, using async operations for scalability.

### 4. Agent Configuration Service

- **Functionality:** 
  - Stores and manages agent definitions, linking to models and data sources.

- **Implementation:** 
  - A service in `@agent-app/services/agent-config`, with a database for agent metadata, using REST APIs for CRUD operations.

### 5. Workflow Management Service

- **Functionality:** 
  - Manages sequences of tasks or interactions for testing.

- **Implementation:** 
  - A service in `@agent-app/services/workflow`, with state management for task sequences, using WebSockets for real-time updates.

### 6. Feedback and Monitoring Service

- **Functionality:** 
  - Collects user feedback and generates analytics.

- **Implementation:** 
  - A service in `@agent-app/services/feedback`, with dashboards in `@agent-app/components/monitoring`, integrating with analytics tools like Google Analytics.

## Summary Table: Key Components and Services

| Stage                | UI Components (Shadcn UI)                     | Microservices/Packages                     |
|----------------------|-----------------------------------------------|-------------------------------------------|
| Data Preparation      | FileUpload, Input, Button, Alert              | Data Management Service, @agent-app/apis/db |
| Agent Setup           | Dialog, Select, RadioGroup, Textarea          | Agent Configuration Service, @agent-app/core |
| Training/Fine-tuning  | Button, Progress, Card                        | Inference Service, @agent-app/services/train |
| Testing/Validation     | Input, Card, Table, Rating, Form             | Workflow Management Service, @agent-app/testing |
| Deployment            | Button, Dialog, Toast                         | Deployment Service, @agent-app/services/deploy |
| Monitoring/Feedback    | DataTable, Chart, Form                       | Feedback and Monitoring Service, @agent-app/monitoring |

This table summarizes the mapping, ensuring clarity for implementation.

## Conclusion

This detailed analysis provides a comprehensive guide for building and testing AI agents using a Next.js monorepo with Shadcn UI, supporting multiple model providers. It leverages insights from Google Agentspace, Vertex AI Builder, and NotebookLM, ensuring a robust and scalable solution as of February 28, 2025.
