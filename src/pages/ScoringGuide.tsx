import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ScoringGuide = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 mt-16">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main className="flex-1 overflow-auto p-6">
            <div className="container mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">BEAM Score Guide</h1>
                <p className="text-muted-foreground">
                  Understanding our lead scoring methodology
                </p>
              </div>

              {/* Overview Section */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <p className="mb-4">
                  The BEAM Score (Business Engagement & Authority Matrix) is our
                  comprehensive lead scoring system that combines traditional BANT
                  qualification with engagement metrics, account characteristics,
                  and market signals to provide a holistic view of lead quality.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Why BEAM Score?
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Combines multiple scoring methodologies</li>
                      <li>Provides actionable insights</li>
                      <li>Adapts to changing market conditions</li>
                      <li>Helps prioritize sales efforts</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Score Components
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>BANT Evaluation (30 points)</li>
                      <li>Engagement Metrics (25 points)</li>
                      <li>Account Characteristics (25 points)</li>
                      <li>Market Signals (20 points)</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Scoring Components Section */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Scoring Components
                </h2>

                {/* BANT Evaluation */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    BANT Evaluation (30 points)
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factor</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Max Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Budget Range</TableCell>
                        <TableCell>
                          Identified budget alignment with solution
                        </TableCell>
                        <TableCell>8</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Authority Level</TableCell>
                        <TableCell>Decision maker's position and influence</TableCell>
                        <TableCell>8</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Need Urgency</TableCell>
                        <TableCell>
                          Immediate need vs future consideration
                        </TableCell>
                        <TableCell>7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Timeline</TableCell>
                        <TableCell>
                          Clear implementation/purchase timeline
                        </TableCell>
                        <TableCell>7</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Engagement Metrics */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Engagement Metrics (25 points)
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Max Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Call Interactions</TableCell>
                        <TableCell>
                          Frequency and quality of call engagements
                        </TableCell>
                        <TableCell>8</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Email Responsiveness</TableCell>
                        <TableCell>
                          Response rate and engagement with emails
                        </TableCell>
                        <TableCell>7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Meeting Participation</TableCell>
                        <TableCell>
                          Attendance and engagement in meetings
                        </TableCell>
                        <TableCell>5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Message Quality</TableCell>
                        <TableCell>
                          Depth and relevance of communications
                        </TableCell>
                        <TableCell>5</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Account Characteristics */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Account Characteristics (25 points)
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Characteristic</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Max Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Company Size</TableCell>
                        <TableCell>Employee count and revenue range</TableCell>
                        <TableCell>7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Industry Vertical</TableCell>
                        <TableCell>
                          Alignment with target industries
                        </TableCell>
                        <TableCell>7</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Technology Stack</TableCell>
                        <TableCell>
                          Compatibility with current systems
                        </TableCell>
                        <TableCell>6</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Geographic Factors</TableCell>
                        <TableCell>
                          Location and market presence
                        </TableCell>
                        <TableCell>5</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Market Signals */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Market Signals (20 points)
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Signal</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Max Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Competitive Situation</TableCell>
                        <TableCell>
                          Current vendor relationships and competition
                        </TableCell>
                        <TableCell>6</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Industry Trends</TableCell>
                        <TableCell>
                          Alignment with industry movements
                        </TableCell>
                        <TableCell>5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Growth Indicators</TableCell>
                        <TableCell>
                          Company growth and market expansion
                        </TableCell>
                        <TableCell>5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Market Timing</TableCell>
                        <TableCell>
                          Seasonal and cyclical factors
                        </TableCell>
                        <TableCell>4</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Score Interpretation */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Score Interpretation
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Score Range</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Recommended Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>80-100</TableCell>
                      <TableCell>Hot Lead</TableCell>
                      <TableCell>
                        Immediate follow-up, high-touch engagement
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>60-79</TableCell>
                      <TableCell>Warm Lead</TableCell>
                      <TableCell>
                        Regular follow-up, relationship building
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>40-59</TableCell>
                      <TableCell>Nurture Lead</TableCell>
                      <TableCell>
                        Educational content, periodic check-ins
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>0-39</TableCell>
                      <TableCell>Cold Lead</TableCell>
                      <TableCell>
                        Automated nurturing, reassess fit
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              {/* Best Practices */}
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      When to Update Scores
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>After every meaningful interaction</li>
                      <li>When new information is discovered</li>
                      <li>During regular review cycles</li>
                      <li>Following status changes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Common Pitfalls
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Overvaluing single interactions</li>
                      <li>Neglecting to update scores regularly</li>
                      <li>Ignoring negative signals</li>
                      <li>Not considering market context</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default ScoringGuide;