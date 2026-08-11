// ==========================================
// PathGraph - CognoDB Idempotent Cypher Seed Script
// ==========================================

// --- Categories ---
MERGE (c1:Category {id: 'cat-fundamentals'}) SET c1.name = 'Core Fundamentals';
MERGE (c2:Category {id: 'cat-frontend'}) SET c2.name = 'Frontend Development';
MERGE (c3:Category {id: 'cat-backend'}) SET c3.name = 'Backend & API Architecture';
MERGE (c4:Category {id: 'cat-data'}) SET c4.name = 'Data Science & AI';
MERGE (c5:Category {id: 'cat-devops'}) SET c5.name = 'DevOps & Cloud';
MERGE (c6:Category {id: 'cat-database'}) SET c6.name = 'Databases & Storage';

// --- Skills ---
MERGE (s1:Skill {id: 'prog-fund'}) SET s1.name = 'Programming Fundamentals', s1.description = 'Control flow, variables, algorithms, data structures, and problem-solving basics.', s1.difficulty = 'Beginner';
MERGE (s2:Skill {id: 'git'}) SET s2.name = 'Version Control (Git)', s2.description = 'Branching, merging, pull requests, commit history, and GitHub workflows.', s2.difficulty = 'Beginner';
MERGE (s3:Skill {id: 'html-css'}) SET s3.name = 'HTML5 & Modern CSS', s3.description = 'Semantic HTML layout, Flexbox, CSS Grid, responsive design, and web accessibility.', s3.difficulty = 'Beginner';
MERGE (s4:Skill {id: 'javascript'}) SET s4.name = 'JavaScript (ES6+)', s4.description = 'Promises, async/await, closures, prototypes, DOM manipulation, and event loop.', s4.difficulty = 'Intermediate';
MERGE (s5:Skill {id: 'typescript'}) SET s5.name = 'TypeScript', s5.description = 'Static typing, interfaces, generics, type inference, and compiler configuration.', s5.difficulty = 'Intermediate';
MERGE (s6:Skill {id: 'react'}) SET s6.name = 'React.js', s6.description = 'Components, hooks, state management, virtual DOM, and component lifecycles.', s6.difficulty = 'Intermediate';
MERGE (s7:Skill {id: 'testing-frontend'}) SET s7.name = 'Frontend Testing', s7.description = 'Unit testing with Jest, component testing with React Testing Library, and E2E with Playwright.', s7.difficulty = 'Advanced';
MERGE (s8:Skill {id: 'nodejs'}) SET s8.name = 'Node.js Runtime', s8.description = 'Event-driven asynchronous I/O, event emitters, modules, and server-side JavaScript.', s8.difficulty = 'Intermediate';
MERGE (s9:Skill {id: 'express'}) SET s9.name = 'Express.js Framework', s9.description = 'HTTP routing, middleware pattern, request parsing, authentication, and error handling.', s9.difficulty = 'Intermediate';
MERGE (s10:Skill {id: 'rest-apis'}) SET s10.name = 'REST API Architecture', s10.description = 'Resource design, HTTP methods, status codes, OpenAPI specs, and serialization.', s10.difficulty = 'Intermediate';
MERGE (s11:Skill {id: 'sql'}) SET s11.name = 'Relational Databases & SQL', s11.description = 'Tables, keys, foreign joins, indexes, transactions, normalization, and SQL querying.', s11.difficulty = 'Intermediate';
MERGE (s12:Skill {id: 'graph-db'}) SET s12.name = 'Graph Databases & Cypher', s12.description = 'Nodes, relationships, property graph model, Cypher pattern matching, and graph algorithms.', s12.difficulty = 'Advanced';
MERGE (s13:Skill {id: 'python'}) SET s13.name = 'Python Programming', s13.description = 'Pythonic idioms, data structures, object-oriented programming, and package ecosystem.', s13.difficulty = 'Beginner';
MERGE (s14:Skill {id: 'data-analysis'}) SET s14.name = 'Data Analysis with Pandas', s14.description = 'DataFrames, data cleaning, aggregation, exploratory data analysis, and visualization.', s14.difficulty = 'Intermediate';
MERGE (s15:Skill {id: 'statistics'}) SET s15.name = 'Statistics & Probability', s15.description = 'Hypothesis testing, distributions, regression, variance, and inferential statistics.', s15.difficulty = 'Intermediate';
MERGE (s16:Skill {id: 'machine-learning'}) SET s16.name = 'Machine Learning', s16.description = 'Supervised and unsupervised learning, decision trees, Scikit-Learn, and model evaluation.', s16.difficulty = 'Advanced';
MERGE (s17:Skill {id: 'deep-learning'}) SET s17.name = 'Deep Learning & Neural Networks', s17.description = 'Convolutional/Recurrent neural networks, PyTorch/TensorFlow, backpropagation, and transformers.', s17.difficulty = 'Advanced';
MERGE (s18:Skill {id: 'linux'}) SET s18.name = 'Linux Systems Administration', s18.description = 'Bash scripting, file permissions, process management, networking basics, and SSH.', s18.difficulty = 'Intermediate';
MERGE (s19:Skill {id: 'docker'}) SET s19.name = 'Docker Containerization', s19.description = 'Dockerfiles, container images, Docker Compose multi-container environments, and volumes.', s19.difficulty = 'Intermediate';
MERGE (s20:Skill {id: 'ci-cd'}) SET s20.name = 'CI/CD Pipelines', s20.description = 'Automated building, testing, integration, and continuous deployment workflows (GitHub Actions).', s20.difficulty = 'Advanced';
MERGE (s21:Skill {id: 'cloud-fundamentals'}) SET s21.name = 'Cloud Infrastructure (AWS/GCP)', s21.description = 'Compute instances, serverless, VPC networking, cloud storage, IAM security, and deployment.', s21.difficulty = 'Advanced';

// --- Connect Skills to Categories ---
MATCH (s:Skill {id: 'prog-fund'}), (c:Category {id: 'cat-fundamentals'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'git'}), (c:Category {id: 'cat-fundamentals'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'html-css'}), (c:Category {id: 'cat-frontend'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'javascript'}), (c:Category {id: 'cat-frontend'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'typescript'}), (c:Category {id: 'cat-frontend'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'react'}), (c:Category {id: 'cat-frontend'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'testing-frontend'}), (c:Category {id: 'cat-frontend'}) MERGE (s)-[:BELONGS_TO]->(c);

MATCH (s:Skill {id: 'nodejs'}), (c:Category {id: 'cat-backend'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'express'}), (c:Category {id: 'cat-backend'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'rest-apis'}), (c:Category {id: 'cat-backend'}) MERGE (s)-[:BELONGS_TO]->(c);

MATCH (s:Skill {id: 'sql'}), (c:Category {id: 'cat-database'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'graph-db'}), (c:Category {id: 'cat-database'}) MERGE (s)-[:BELONGS_TO]->(c);

MATCH (s:Skill {id: 'python'}), (c:Category {id: 'cat-data'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'data-analysis'}), (c:Category {id: 'cat-data'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'statistics'}), (c:Category {id: 'cat-data'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'machine-learning'}), (c:Category {id: 'cat-data'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'deep-learning'}), (c:Category {id: 'cat-data'}) MERGE (s)-[:BELONGS_TO]->(c);

MATCH (s:Skill {id: 'linux'}), (c:Category {id: 'cat-devops'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'docker'}), (c:Category {id: 'cat-devops'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'ci-cd'}), (c:Category {id: 'cat-devops'}) MERGE (s)-[:BELONGS_TO]->(c);
MATCH (s:Skill {id: 'cloud-fundamentals'}), (c:Category {id: 'cat-devops'}) MERGE (s)-[:BELONGS_TO]->(c);

// --- Skill Prerequisite Hierarchy (:Skill)-[:REQUIRES]->(:Skill) ---
MATCH (s:Skill {id: 'javascript'}), (pre:Skill {id: 'prog-fund'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'html-css'}), (pre:Skill {id: 'prog-fund'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'typescript'}), (pre:Skill {id: 'javascript'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'react'}), (pre:Skill {id: 'javascript'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'react'}), (pre:Skill {id: 'html-css'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'testing-frontend'}), (pre:Skill {id: 'react'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'testing-frontend'}), (pre:Skill {id: 'typescript'}) MERGE (s)-[:REQUIRES]->(pre);

MATCH (s:Skill {id: 'nodejs'}), (pre:Skill {id: 'javascript'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'express'}), (pre:Skill {id: 'nodejs'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'rest-apis'}), (pre:Skill {id: 'express'}) MERGE (s)-[:REQUIRES]->(pre);

MATCH (s:Skill {id: 'graph-db'}), (pre:Skill {id: 'sql'}) MERGE (s)-[:REQUIRES]->(pre);

MATCH (s:Skill {id: 'python'}), (pre:Skill {id: 'prog-fund'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'data-analysis'}), (pre:Skill {id: 'python'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'statistics'}), (pre:Skill {id: 'python'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'machine-learning'}), (pre:Skill {id: 'data-analysis'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'machine-learning'}), (pre:Skill {id: 'statistics'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'deep-learning'}), (pre:Skill {id: 'machine-learning'}) MERGE (s)-[:REQUIRES]->(pre);

MATCH (s:Skill {id: 'docker'}), (pre:Skill {id: 'git'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'linux'}), (pre:Skill {id: 'git'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'ci-cd'}), (pre:Skill {id: 'docker'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'cloud-fundamentals'}), (pre:Skill {id: 'ci-cd'}) MERGE (s)-[:REQUIRES]->(pre);
MATCH (s:Skill {id: 'cloud-fundamentals'}), (pre:Skill {id: 'linux'}) MERGE (s)-[:REQUIRES]->(pre);

// --- Roles ---
MERGE (r1:Role {id: 'frontend-engineer'}) SET r1.name = 'Frontend Engineer', r1.description = 'Builds responsive, performant user interfaces, component design systems, and client-side applications.';
MERGE (r2:Role {id: 'backend-engineer'}) SET r2.name = 'Backend Engineer', r2.description = 'Architects resilient server APIs, database schema models, authentication, and backend services.';
MERGE (r3:Role {id: 'fullstack-engineer'}) SET r3.name = 'Full Stack Engineer', r3.description = 'Master of end-to-end software delivery from responsive UIs down to databases and API infrastructure.';
MERGE (r4:Role {id: 'data-scientist'}) SET r4.name = 'Data Scientist', r4.description = 'Extracts statistical insights from complex data, builds predictive models, and communicates findings.';
MERGE (r5:Role {id: 'ml-engineer'}) SET r5.name = 'Machine Learning Engineer', r5.description = 'Deploys production machine learning pipelines, trains neural networks, and optimizes inference.';
MERGE (r6:Role {id: 'devops-engineer'}) SET r6.name = 'DevOps & Cloud Engineer', r6.description = 'Automates CI/CD deployment pipelines, manages cloud infrastructure, and enforces system reliability.';

// --- Connect Roles to Required Skills (:Role)-[:REQUIRES]->(:Skill) ---
MATCH (r:Role {id: 'frontend-engineer'}), (s:Skill {id: 'html-css'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'frontend-engineer'}), (s:Skill {id: 'javascript'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'frontend-engineer'}), (s:Skill {id: 'typescript'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'frontend-engineer'}), (s:Skill {id: 'react'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'frontend-engineer'}), (s:Skill {id: 'git'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'frontend-engineer'}), (s:Skill {id: 'testing-frontend'}) MERGE (r)-[:REQUIRES]->(s);

MATCH (r:Role {id: 'backend-engineer'}), (s:Skill {id: 'javascript'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'backend-engineer'}), (s:Skill {id: 'nodejs'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'backend-engineer'}), (s:Skill {id: 'rest-apis'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'backend-engineer'}), (s:Skill {id: 'sql'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'backend-engineer'}), (s:Skill {id: 'graph-db'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'backend-engineer'}), (s:Skill {id: 'docker'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'backend-engineer'}), (s:Skill {id: 'git'}) MERGE (r)-[:REQUIRES]->(s);

MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'javascript'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'typescript'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'react'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'nodejs'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'rest-apis'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'sql'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'docker'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'fullstack-engineer'}), (s:Skill {id: 'git'}) MERGE (r)-[:REQUIRES]->(s);

MATCH (r:Role {id: 'data-scientist'}), (s:Skill {id: 'python'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'data-scientist'}), (s:Skill {id: 'data-analysis'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'data-scientist'}), (s:Skill {id: 'statistics'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'data-scientist'}), (s:Skill {id: 'sql'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'data-scientist'}), (s:Skill {id: 'machine-learning'}) MERGE (r)-[:REQUIRES]->(s);

MATCH (r:Role {id: 'ml-engineer'}), (s:Skill {id: 'python'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'ml-engineer'}), (s:Skill {id: 'data-analysis'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'ml-engineer'}), (s:Skill {id: 'statistics'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'ml-engineer'}), (s:Skill {id: 'machine-learning'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'ml-engineer'}), (s:Skill {id: 'deep-learning'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'ml-engineer'}), (s:Skill {id: 'docker'}) MERGE (r)-[:REQUIRES]->(s);

MATCH (r:Role {id: 'devops-engineer'}), (s:Skill {id: 'git'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'devops-engineer'}), (s:Skill {id: 'linux'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'devops-engineer'}), (s:Skill {id: 'docker'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'devops-engineer'}), (s:Skill {id: 'ci-cd'}) MERGE (r)-[:REQUIRES]->(s);
MATCH (r:Role {id: 'devops-engineer'}), (s:Skill {id: 'cloud-fundamentals'}) MERGE (r)-[:REQUIRES]->(s);

// --- Resources ---
MERGE (res1:Resource {id: 'res-mdn-js'}) SET res1.title = 'MDN Web Docs: Modern JavaScript Guide', res1.type = 'Documentation', res1.url = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', res1.difficulty = 'Beginner';
MERGE (res2:Resource {id: 'res-react-docs'}) SET res2.title = 'React Official Interactive Documentation', res2.type = 'Interactive Course', res2.url = 'https://react.dev/learn', res2.difficulty = 'Intermediate';
MERGE (res3:Resource {id: 'res-ts-handbook'}) SET res3.title = 'The TypeScript Handbook', res3.type = 'Book / Docs', res3.url = 'https://www.typescriptlang.org/docs/handbook/intro.html', res3.difficulty = 'Intermediate';
MERGE (res4:Resource {id: 'res-node-patterns'}) SET res4.title = 'Node.js Design Patterns by Mario Casciaro', res4.type = 'Book', res4.url = 'https://www.nodejsdesignpatterns.com/', res4.difficulty = 'Advanced';
MERGE (res5:Resource {id: 'res-cognodb-cypher'}) SET res5.title = 'CognoDB & Cypher Graph Traversal Guide', res5.type = 'Interactive Tutorial', res5.url = 'https://neo4j.com/docs/cypher-manual/current/', res5.difficulty = 'Intermediate';
MERGE (res6:Resource {id: 'res-python-data'}) SET res6.title = 'Python for Data Analysis by Wes McKinney', res6.type = 'Book', res6.url = 'https://wesmckinney.com/book/', res6.difficulty = 'Intermediate';
MERGE (res7:Resource {id: 'res-fastai'}) SET res7.title = 'Practical Deep Learning for Coders (Fast.ai)', res7.type = 'Video Course', res7.url = 'https://course.fast.ai/', res7.difficulty = 'Advanced';
MERGE (res8:Resource {id: 'res-docker-mastery'}) SET res8.title = 'Docker Mastery: With Kubernetes & Swarm', res8.type = 'Video Course', res8.url = 'https://www.docker.com/get-started/', res8.difficulty = 'Intermediate';

// --- Connect Resources (:Resource)-[:TEACHES]->(:Skill) ---
MATCH (res:Resource {id: 'res-mdn-js'}), (s:Skill {id: 'javascript'}) MERGE (res)-[:TEACHES]->(s);
MATCH (res:Resource {id: 'res-react-docs'}), (s:Skill {id: 'react'}) MERGE (res)-[:TEACHES]->(s);
MATCH (res:Resource {id: 'res-ts-handbook'}), (s:Skill {id: 'typescript'}) MERGE (res)-[:TEACHES]->(s);
MATCH (res:Resource {id: 'res-node-patterns'}), (s:Skill {id: 'nodejs'}) MERGE (res)-[:TEACHES]->(s);
MATCH (res:Resource {id: 'res-cognodb-cypher'}), (s:Skill {id: 'graph-db'}) MERGE (res)-[:TEACHES]->(s);
MATCH (res:Resource {id: 'res-python-data'}), (s:Skill {id: 'data-analysis'}) MERGE (res)-[:TEACHES]->(s);
MATCH (res:Resource {id: 'res-fastai'}), (s:Skill {id: 'deep-learning'}) MERGE (res)-[:TEACHES]->(s);
MATCH (res:Resource {id: 'res-docker-mastery'}), (s:Skill {id: 'docker'}) MERGE (res)-[:TEACHES]->(s);

// --- Projects ---
MERGE (p1:Project {id: 'proj-portfolio'}) SET p1.title = 'Responsive Developer Portfolio Website', p1.description = 'Design and deploy a semantic, fully responsive portfolio showcasing interactive projects.', p1.difficulty = 'Beginner';
MERGE (p2:Project {id: 'proj-kanban'}) SET p2.title = 'Interactive Kanban Task Management App', p2.description = 'Build a drag-and-drop task board in React & TypeScript with local persistence.', p2.difficulty = 'Intermediate';
MERGE (p3:Project {id: 'proj-api-microservice'}) SET p3.title = 'RESTful microservice with JWT Auth & SQL', p3.description = 'Construct a production Node.js/Express API connected to PostgreSQL with rate-limiting.', p3.difficulty = 'Intermediate';
MERGE (p4:Project {id: 'proj-churn-predictor'}) SET p4.title = 'Customer Churn Machine Learning Model', p4.description = 'Clean telemetry data in Pandas, train XGBoost classifier, and report feature importance.', p4.difficulty = 'Advanced';
MERGE (p5:Project {id: 'proj-graph-explorer'}) SET p5.title = 'PathGraph Cypher Relationship Explorer', p5.description = 'Build a multi-hop graph traversal engine backed by CognoDB graph database.', p5.difficulty = 'Advanced';

// --- Connect Projects (:Project)-[:PRACTICES]->(:Skill) ---
MATCH (p:Project {id: 'proj-portfolio'}), (s:Skill {id: 'html-css'}) MERGE (p)-[:PRACTICES]->(s);
MATCH (p:Project {id: 'proj-portfolio'}), (s:Skill {id: 'javascript'}) MERGE (p)-[:PRACTICES]->(s);

MATCH (p:Project {id: 'proj-kanban'}), (s:Skill {id: 'react'}) MERGE (p)-[:PRACTICES]->(s);
MATCH (p:Project {id: 'proj-kanban'}), (s:Skill {id: 'typescript'}) MERGE (p)-[:PRACTICES]->(s);

MATCH (p:Project {id: 'proj-api-microservice'}), (s:Skill {id: 'nodejs'}) MERGE (p)-[:PRACTICES]->(s);
MATCH (p:Project {id: 'proj-api-microservice'}), (s:Skill {id: 'express'}) MERGE (p)-[:PRACTICES]->(s);
MATCH (p:Project {id: 'proj-api-microservice'}), (s:Skill {id: 'sql'}) MERGE (p)-[:PRACTICES]->(s);

MATCH (p:Project {id: 'proj-churn-predictor'}), (s:Skill {id: 'python'}) MERGE (p)-[:PRACTICES]->(s);
MATCH (p:Project {id: 'proj-churn-predictor'}), (s:Skill {id: 'data-analysis'}) MERGE (p)-[:PRACTICES]->(s);
MATCH (p:Project {id: 'proj-churn-predictor'}), (s:Skill {id: 'machine-learning'}) MERGE (p)-[:PRACTICES]->(s);

MATCH (p:Project {id: 'proj-graph-explorer'}), (s:Skill {id: 'graph-db'}) MERGE (p)-[:PRACTICES]->(s);
MATCH (p:Project {id: 'proj-graph-explorer'}), (s:Skill {id: 'react'}) MERGE (p)-[:PRACTICES]->(s);

// --- Sample User Node ---
MERGE (u:User {id: 'demo-user'}) SET u.name = 'Demo Candidate Developer';

// Give initial skills to demo user
MATCH (u:User {id: 'demo-user'}), (s:Skill {id: 'prog-fund'}) MERGE (u)-[:HAS_SKILL]->(s);
MATCH (u:User {id: 'demo-user'}), (s:Skill {id: 'git'}) MERGE (u)-[:HAS_SKILL]->(s);
MATCH (u:User {id: 'demo-user'}), (s:Skill {id: 'html-css'}) MERGE (u)-[:HAS_SKILL]->(s);
MATCH (u:User {id: 'demo-user'}), (s:Skill {id: 'javascript'}) MERGE (u)-[:HAS_SKILL]->(s);
