import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { createDocument } from '@/lib/firebase-admin';
import { BlogPost } from '@/lib/firebase';

const initialBlogPosts = [
  {
    title: "How to Choose the Right Pool Table Size for Your Home",
    slug: "choosing-pool-table-size",
    excerpt: "Learn about the different pool table sizes and how to determine which one fits best in your space.",
    content: `When choosing a pool table for your home, size is one of the most important factors to consider. The standard sizes are 7-foot (bar size), 8-foot (home size), and 9-foot (tournament size).

For most home game rooms, an 8-foot table provides the perfect balance of playability and space efficiency. However, you'll need to consider not just the table dimensions, but also the room space required for comfortable play.

Here's what you need to know about room requirements:

**7-Foot Tables:** Need a room at least 13' x 16'
**8-Foot Tables:** Need a room at least 13.5' x 17'
**9-Foot Tables:** Need a room at least 14' x 18'

Remember, these measurements assume standard 58-inch cues. If your room is smaller, consider shorter cues or a smaller table size.

At Affordable Billiards, we help you measure your space and recommend the perfect table size for your home. Contact us for a free consultation!`,
    author: "Matt - Affordable Billiards",
    category: "Buying Guide",
    tags: ["pool table size", "home setup", "buying guide"],
    image: "/images/blog/pool-table-sizes.jpg",
    status: "published" as const
  },
  {
    title: "Professional Pool Table Moving: Why DIY Isn't Worth the Risk",
    slug: "professional-pool-table-moving",
    excerpt: "Discover why professional pool table moving services are essential for protecting your investment.",
    content: `Moving a pool table might seem straightforward, but it's one of the most complex furniture moves you can undertake. Here's why you should always use professional movers:

**Proper Disassembly is Critical**
Pool tables must be completely disassembled for moving. The slate (which can weigh 200-800 pounds) must be removed carefully to avoid cracking. The legs, rails, and felt all require specific handling.

**Specialized Equipment Required**
- Dollies rated for slate weight
- Proper lifting straps
- Tools for precise reassembly
- New felt (often needed after a move)

**Precision Leveling**
Reassembly isn't just putting pieces back together. The table must be perfectly level - even 1/16th of an inch can affect play. Professional installers use precision levels and shimming techniques.

**Common DIY Disasters We've Seen:**
- Cracked slate (often unfixable)
- Damaged table frames
- Improper leveling causing poor play
- Torn felt requiring replacement

At Affordable Billiards, we've moved hundreds of tables across Michigan. Our experienced team ensures your table arrives in perfect condition and plays like new.

Contact us for professional, insured pool table moving services!`,
    author: "Matt - Affordable Billiards",
    category: "Moving Tips",
    tags: ["table moving", "professional service", "Michigan"],
    image: "/images/blog/table-moving.jpg",
    status: "published" as const
  },
  {
    title: "What to Look for When Buying a Used Pool Table",
    slug: "buying-used-pool-table-guide",
    excerpt: "A comprehensive guide to inspecting and evaluating used pool tables before purchase.",
    content: `Buying a used pool table can save you thousands, but knowing what to look for is crucial. Here's our professional buyer's guide:

**Check the Slate**
The slate is the heart of any quality pool table. Look for:
- Cracks or chips (deal breakers)
- Proper thickness (3/4" to 1" for quality tables)
- Level installation
- Clean, smooth surface

**Inspect the Frame**
- Solid wood construction preferred
- No loose joints or wobbling
- Check for water damage or warping
- Ensure leg attachment points are solid

**Examine the Rails**
- Rubber cushions should be responsive
- No dead spots or excessive bouncing
- Rails should be firmly attached
- Look for worn or damaged rubber

**Evaluate the Felt**
- Even wear patterns are normal
- Avoid tables with tears, burns, or stains
- Remember: felt replacement costs $200-400

**Test the Pockets**
- Leather pockets age better than plastic
- Check mounting hardware
- Ensure proper ball return (if applicable)

**Ask About History**
- How long owned?
- Reason for selling?
- Any repairs or modifications?
- Original purchase location?

**Red Flags to Avoid:**
- Unusually low prices (often damaged)
- Sellers who won't allow inspection
- Tables stored in damp basements
- Modified or homemade tables

At Affordable Billiards, all our used tables are thoroughly inspected and refurbished as needed. We provide honest assessments and stand behind our quality.

Looking for a quality used table? Browse our current inventory or contact us about specific needs!`,
    author: "Matt - Affordable Billiards",
    category: "Buying Guide",
    tags: ["used tables", "inspection", "buying tips"],
    image: "/images/blog/used-table-inspection.jpg",
    status: "published" as const
  }
];

// POST - Seed initial blog posts (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    console.log('Seed route - session:', session?.user?.email);
    
    if (!session?.user?.email) {
      console.log('Seed route - No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = [];
    
    for (const post of initialBlogPosts) {
      try {
        const blogData: Partial<BlogPost> = {
          ...post,
          publishedAt: new Date().toISOString(),
        };

        const id = await createDocument('blog_posts', blogData);
        results.push({ id, title: post.title, status: 'created' });
      } catch (error) {
        console.error(`Error creating blog post "${post.title}":`, error);
        results.push({ 
          title: post.title, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    }
    
    return NextResponse.json({ 
      message: 'Blog seeding completed', 
      results: results,
      created: results.filter(r => r.status === 'created').length,
      errors: results.filter(r => r.status === 'error').length
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding blog posts:', error);
    return NextResponse.json({ error: 'Failed to seed blog posts' }, { status: 500 });
  }
}