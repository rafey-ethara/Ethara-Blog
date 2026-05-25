require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const dns = require('dns');

// Configure public DNS servers if default loopback is active, to resolve MongoDB SRV records.
try {
  const servers = dns.getServers();
  if (servers.length === 0 || servers.includes('127.0.0.1') || servers.includes('::1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch (e) {
  // Ignore DNS config errors
}

const mongoose = require('mongoose');
const Author = require('../models/Author');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Post = require('../models/Post');
const Subscriber = require('../models/Subscriber');
const ContactSubmission = require('../models/ContactSubmission');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Author.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Post.deleteMany({}),
      Subscriber.deleteMany({}),
      ContactSubmission.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // --- Author ---
    const author = await Author.create({
      name: 'Alex Carter',
      email: 'alex@ethara.blog',
      passwordHash: 'Admin@1234',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      bio: 'Tech writer, design enthusiast, and lifelong learner. I write about technology, design systems, and the future of the web. Based in San Francisco, fueled by coffee and curiosity.',
      socialLinks: {
        twitter: 'https://twitter.com/alexcarter',
        github: 'https://github.com/alexcarter',
        linkedin: 'https://linkedin.com/in/alexcarter',
        website: 'https://alexcarter.dev',
      },
      role: 'admin',
    });
    console.log(`✅ Author created: ${author.name} (email: alex@ethara.blog, password: Admin@1234)`);

    // --- Categories ---
    const [techCat, designCat, productivityCat] = await Category.create([
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Deep dives into the latest in software, AI, and the tools shaping our digital future.',
        color: '#6366F1',
      },
      {
        name: 'Design',
        slug: 'design',
        description: 'Exploring the intersection of aesthetics and function — from UI principles to design systems.',
        color: '#EC4899',
      },
      {
        name: 'Productivity',
        slug: 'productivity',
        description: 'Systems, strategies, and tools to help you do your best work without burning out.',
        color: '#10B981',
      },
    ]);
    console.log('✅ Categories created: Technology, Design, Productivity');

    // --- Tags ---
    const [aiTag, webTag, cssTag, figmaTag, focusTag] = await Tag.create([
      { name: 'AI', slug: 'ai' },
      { name: 'Web Dev', slug: 'web-dev' },
      { name: 'CSS', slug: 'css' },
      { name: 'Figma', slug: 'figma' },
      { name: 'Focus', slug: 'focus' },
    ]);
    console.log('✅ Tags created: AI, Web Dev, CSS, Figma, Focus');

    // --- Posts ---
    const postData = [
      {
        title: 'The Future of AI in Web Development',
        slug: 'future-of-ai-in-web-development',
        content: `
          <h2>A New Era of Development</h2>
          <p>Artificial intelligence is no longer a distant concept reserved for research labs — it is actively reshaping how developers write, review, and ship code. From AI-powered autocompletion to natural language interfaces that generate entire components, the tools available today would have seemed like science fiction just five years ago.</p>
          <p>The most exciting shift is not in any single tool, but in the underlying philosophy. Development is moving from a syntax-centric discipline toward an intent-driven one. Instead of asking "how do I write this function?", developers increasingly ask "what should this function do?" — and let AI handle the implementation details.</p>
          <h2>Real-World Impact</h2>
          <p>Teams using AI-assisted workflows report significant productivity gains — not because AI writes perfect code, but because it dramatically reduces the friction of starting. The blank page problem, the context-switching cost, the time spent on boilerplate — all of these are shrinking. This creates space for the uniquely human parts of the job: system design, user empathy, and creative problem solving.</p>
          <h2>What This Means for Learning</h2>
          <p>Perhaps the most profound implication is for how we learn. If AI can scaffold implementations, the premium on rote syntax knowledge decreases. What matters more is the ability to evaluate code, spot architectural flaws, and articulate requirements clearly. The meta-skills — communication, critical thinking, domain expertise — become the differentiator.</p>
          <p>The future belongs to developers who treat AI as a collaborator, not a replacement. Those who learn to prompt effectively, verify intelligently, and integrate thoughtfully will find their productivity multiplied.</p>
        `,
        excerpt: 'From autocompletion to full component generation — AI is fundamentally changing what it means to build for the web.',
        coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop',
        coverImageAlt: 'Abstract AI neural network visualization',
        category: techCat._id,
        tags: [aiTag._id, webTag._id],
        status: 'published',
        publishedAt: new Date('2025-03-15'),
      },
      {
        title: 'Building a Design System from Scratch in 2025',
        slug: 'building-design-system-from-scratch-2025',
        content: `
          <h2>Why Design Systems Matter</h2>
          <p>A design system is not just a collection of components — it is a shared language between designers and developers. Without one, every decision is renegotiated at each feature boundary. Colors drift. Spacing becomes inconsistent. Buttons multiply across codebases with subtle but maddening differences.</p>
          <p>In 2025, the tooling for design systems has never been better. Figma Variables make it possible to encode your entire token system visually. CSS custom properties carry those tokens into the browser natively. Component libraries like Radix and Ariakit provide accessible primitives so you are not reinventing accessibility from scratch.</p>
          <h2>Start with Tokens, Not Components</h2>
          <p>The most common mistake when building a design system is starting with components. Start with tokens. Define your color palette (and its semantic meaning), your spacing scale, your typography scale, and your border radius values. These decisions cascade through everything that follows.</p>
          <p>A good token structure separates global values from semantic aliases. Global: <code>color-violet-500</code>. Semantic: <code>color-brand-primary</code>. The semantic layer is what your components consume. The global layer is what you swap when you need a theme.</p>
          <h2>The Component Architecture Question</h2>
          <p>Once your tokens are in place, component architecture becomes a question of granularity. The atomic design methodology — atoms, molecules, organisms — remains a useful mental model. Atoms are your smallest indivisible pieces (Button, Badge, Input). Molecules compose atoms (SearchField = Input + Button). Organisms are larger sections (Header = Logo + Navigation + SearchField).</p>
          <p>The real goal is not adherence to any methodology, but a system where adding a new screen does not require inventing new patterns. If you find yourself creating a one-off component, that is a signal to revisit your system.</p>
        `,
        excerpt: 'Tokens before components. Semantics before aesthetics. A practical guide to building a design system that scales.',
        coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=630&fit=crop',
        coverImageAlt: 'Design system component library on a screen',
        category: designCat._id,
        tags: [figmaTag._id, cssTag._id],
        status: 'published',
        publishedAt: new Date('2025-04-02'),
      },
      {
        title: 'CSS Grid in 2025: Patterns Worth Knowing',
        slug: 'css-grid-2025-patterns-worth-knowing',
        content: `
          <h2>Grid Has Grown Up</h2>
          <p>CSS Grid landed in browsers back in 2017, but its full potential is only now being realized in production codebases. Subgrid support, which took years to reach all major browsers, changes everything about how we think about aligned layouts. And the newly available <code>masonry</code> display value — still behind a flag but stable in Firefox — promises to make complex card grids far simpler to build.</p>
          <p>The developer community has also matured in how it teaches Grid. Early tutorials focused on the mechanics of <code>grid-template-columns</code> and <code>grid-area</code>. Modern guidance emphasizes patterns — recurring layout solutions that can be applied without re-deriving the underlying math each time.</p>
          <h2>The Most Useful Patterns</h2>
          <p>The <strong>RAM pattern</strong> (Repeat, Auto, Minmax) — <code>grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))</code> — creates a responsive grid without a single media query. Cards wrap naturally as the container narrows. It is the single most useful CSS Grid trick for product interfaces.</p>
          <p>The <strong>full-bleed layout</strong> pattern uses a named grid to allow certain elements (like hero images or callout banners) to break out of the content column and span the full width of the page, while body text stays centered. All in a single parent grid, no wrapper divs needed.</p>
          <h2>Subgrid Changes the Game</h2>
          <p>Before subgrid, aligning elements across cards in a grid required JavaScript measurement or careful height tricks. Subgrid allows a child grid to inherit the track definitions of its parent, enabling true cross-component alignment. Card headers, body text, and footers can all align to a shared grid — effortlessly.</p>
        `,
        excerpt: 'Subgrid, masonry, and the RAM pattern — the CSS Grid features and techniques that matter most in 2025.',
        coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop',
        coverImageAlt: 'CSS code on a dark monitor',
        category: techCat._id,
        tags: [cssTag._id, webTag._id],
        status: 'published',
        publishedAt: new Date('2025-04-20'),
      },
      {
        title: 'How I Redesigned My Workflow with Figma Variables',
        slug: 'redesigned-workflow-figma-variables',
        content: `
          <h2>The Problem with Old-Style Design Tokens</h2>
          <p>For years, maintaining design tokens in Figma meant using a combination of styles, plugins, and a prayer. Colors lived in a styles panel that was powerful but rigid. Switching between light and dark mode required a plugin, or worse, duplicating entire frames. Designers and developers ended up with diverging sources of truth, which is precisely the problem tokens are meant to solve.</p>
          <p>Figma Variables, introduced in late 2023 and significantly expanded since, change this entirely. Variables are structured, nameable, mode-aware, and exportable. They are the missing foundation that makes Figma a genuine source of truth for a design system.</p>
          <h2>Setting Up a Variable Architecture</h2>
          <p>I structure variables in three layers. The first is the primitive layer — every raw value in the system. Every color in the palette, every spacing unit, every font size. These variables are named descriptively (<code>color/violet/500</code>) but carry no semantic meaning.</p>
          <p>The second is the semantic layer. These variables reference primitives and carry meaning. <code>color/brand/primary</code> references <code>color/violet/500</code> in light mode and might reference a lighter value in dark mode. Components consume semantic variables, never primitives directly.</p>
          <p>The third is the component layer — values specific to a component that might need to override the semantic defaults. A button's disabled state color, for example.</p>
          <h2>The Workflow Transformation</h2>
          <p>With this structure in place, switching between light and dark mode is a single click. Rebranding — swapping the primitive palette — cascades through the entire system automatically. Handoff to developers is cleaner because the variable names match the CSS custom property names. The time saved per design cycle is significant, but the bigger win is the confidence that what you are designing matches what gets built.</p>
        `,
        excerpt: 'Three-layer variable architecture, mode switching, and handoff — how Figma Variables finally made design tokens worth using.',
        coverImage: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1200&h=630&fit=crop',
        coverImageAlt: 'Figma design interface with variable panel open',
        category: designCat._id,
        tags: [figmaTag._id],
        status: 'published',
        publishedAt: new Date('2025-05-08'),
      },
      {
        title: 'Deep Work in the Age of Notifications',
        slug: 'deep-work-age-of-notifications',
        content: `
          <h2>The Attention Economy Has a Tab Open on Your Brain</h2>
          <p>Cal Newport popularized the term "deep work" — the ability to focus without distraction on cognitively demanding tasks — but the concept has become harder to practice as software has become more aggressive in competing for attention. Every app wants a notification permission. Every platform has a badge count designed to create anxiety. The default state of a knowledge worker's environment is now hostile to concentration.</p>
          <p>This is not an accident. Attention is the product, and distraction is the mechanism of delivery. Understanding this makes the countermeasures clearer: the goal is not personal willpower but environmental design.</p>
          <h2>The Three Levers of Environmental Design</h2>
          <p>The first lever is <strong>scheduling</strong>. Deep work does not happen in the gaps between meetings — it requires dedicated blocks. Cal Newport recommends scheduling these blocks like appointments. I have found that morning blocks, before email and Slack have loaded the day with other people's priorities, are consistently the most productive.</p>
          <p>The second lever is <strong>friction</strong>. Make distraction harder to access. Log out of social media. Put your phone in another room. Use website blockers during deep work sessions. The goal is not to eliminate temptation through force of will but to raise the cost of acting on it high enough that you rarely do.</p>
          <p>The third lever is <strong>ritual</strong>. A consistent start ritual — a specific location, a specific playlist, a specific first action — trains your brain to shift into focus mode. The ritual is a trigger. Over time, the trigger works faster and the focus comes more readily.</p>
          <h2>Making It Sustainable</h2>
          <p>Deep work is exhausting because it is demanding. Most people can sustain three to four hours of genuine deep work per day — after that, diminishing returns set in. The goal is not to be in deep focus all day but to protect and deploy your best cognitive hours for the work that matters most. Shallow work fills the rest — email, admin, meetings. Both have their place. The problem is when shallow work colonizes the time that should belong to deep work.</p>
        `,
        excerpt: 'Environmental design, scheduling, and ritual — practical strategies for reclaiming your attention in a world built to steal it.',
        coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop',
        coverImageAlt: 'Person working focused at a clean desk',
        category: productivityCat._id,
        tags: [focusTag._id],
        status: 'published',
        publishedAt: new Date('2025-05-18'),
      },
    ];

    const posts = await Post.create(postData.map((post) => ({ ...post, author: author._id })));
    console.log(`✅ Posts created: ${posts.map((p) => p.title).join(', ')}`);

    // --- Subscribers ---
    await Subscriber.create([
      { name: 'Priya Sharma', email: 'priya.sharma@example.com', subscribedAt: new Date('2025-03-20') },
      { name: 'Marcus Johnson', email: 'marcus.j@example.com', subscribedAt: new Date('2025-04-10') },
      { name: 'Lena Fischer', email: 'lena.fischer@example.com', subscribedAt: new Date('2025-05-01') },
    ]);
    console.log('✅ Subscribers created: 3 subscribers');

    // --- Contact Submissions ---
    await ContactSubmission.create([
      {
        name: 'Jordan Blake',
        email: 'jordan.blake@example.com',
        phone: '+1 555 234 5678',
        subject: 'Collaboration Opportunity',
        message: 'Hi! I loved your article on AI in web development. I am a startup founder working on an AI code review tool and would love to discuss a potential collaboration or guest post.',
        createdAt: new Date('2025-04-25'),
      },
      {
        name: 'Aisha Patel',
        email: 'aisha.patel@example.com',
        phone: '+44 20 7946 0958',
        subject: 'Question about Design Systems',
        message: 'Your design system article was incredibly helpful. I am wondering if you have any recommendations for teams that are just starting out with a small budget — any open-source resources?',
        createdAt: new Date('2025-05-12'),
      },
    ]);
    console.log('✅ Contact submissions created: 2 submissions');

    console.log('\n🎉 Database seeded successfully!');
    console.log('👤 Admin login: alex@ethara.blog / Admin@1234');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
