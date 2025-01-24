import { Card } from "@/components/ui/card";
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
    <div className="flex-1 overflow-auto p-6">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">BEAM Score Guide</h1>
          <p className="text-muted-foreground">
            Understanding our comprehensive lead scoring methodology enhanced with AI analysis
          </p>
        </div>

        {/* Overview Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            The BEAM Score (Business Engagement & Authority Matrix) is our
            comprehensive lead scoring system that evaluates leads across four key
            dimensions, with each component contributing up to 25 points for a
            total maximum score of 100. The system is enhanced by AI analysis for more accurate scoring.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Components</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>BANT Evaluation (25 points)</li>
                <li>Engagement Metrics (25 points)</li>
                <li>Account Characteristics (25 points)</li>
                <li>Market Signals (25 points)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">AI Enhancement</h3>
              <p className="text-muted-foreground">
                Our AI system analyzes leads to provide deeper insights and influence scoring in these areas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                <li>Message quality analysis</li>
                <li>Company research and validation</li>
                <li>Technical requirements assessment</li>
                <li>Opportunity evaluation</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* BANT Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">BANT Score (25 points)</h2>
          <p className="mb-4 text-muted-foreground">
            AI analysis helps validate and enhance BANT scoring through message content analysis and company research.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Budget Range</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Enterprise ($100k+): 7 points</li>
                    <li>Mid-Market ($50k-$100k): 5 points</li>
                    <li>Small Business ($10k-$50k): 3 points</li>
                    <li>Startup (Under $10k): 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Authority Level</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>C-Level Executive: 6 points</li>
                    <li>VP/Director: 4 points</li>
                    <li>Senior Manager: 3 points</li>
                    <li>Manager: 2 points</li>
                    <li>Individual Contributor: 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Need Urgency</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Immediate Need: 6 points</li>
                    <li>Next Quarter: 4 points</li>
                    <li>Within 6 Months: 2 points</li>
                    <li>Future Consideration: 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Timeline</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Immediate Start: 6 points</li>
                    <li>1-3 Months: 4 points</li>
                    <li>3-6 Months: 2 points</li>
                    <li>6+ Months: 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>6</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Engagement Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Engagement Score (25 points)
          </h2>
          <p className="mb-4 text-muted-foreground">
            AI analysis evaluates message quality and engagement patterns to provide more accurate scoring.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Call Interactions</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>6+ calls: 10 points</li>
                    <li>3-5 calls: 6 points</li>
                    <li>1-2 calls: 3 points</li>
                    <li>No calls: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Email Quality</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Business email: 8 points</li>
                    <li>Personal or other email: 1 point</li>
                    <li>No email: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Message Quality</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Detailed message (200+ characters): 7 points</li>
                    <li>Basic message (50-200 characters): 4 points</li>
                    <li>Low quality or no message: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Account Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Account Score (25 points)
          </h2>
          <p className="mb-4 text-muted-foreground">
            AI analysis enriches account scoring through automated company research and validation.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Company Size</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Enterprise (1000+ employees): 10 points</li>
                    <li>Mid-Market (100-999 employees): 7 points</li>
                    <li>Small Business (10-99 employees): 4 points</li>
                    <li>Startup (1-9 employees): 2 points</li>
                  </ul>
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Industry Vertical</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>High-priority (Tech, Healthcare, Finance): 8 points</li>
                    <li>Medium-priority (Manufacturing, Services): 5 points</li>
                    <li>Other industries: 3 points</li>
                  </ul>
                </TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Company Profile</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>AI-verified strong fit: 7 points</li>
                    <li>AI-verified moderate fit: 5 points</li>
                    <li>AI-verified basic fit: 3 points</li>
                    <li>Unverified: 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Market Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Market Score (25 points)</h2>
          <p className="mb-4 text-muted-foreground">
            AI analysis enhances market scoring through technical stack analysis and opportunity assessment.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Geographic Location</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Tier 1 (USA, UK, Canada): 10 points</li>
                    <li>Tier 2 (Europe, Australia, Japan): 8 points</li>
                    <li>Tier 3 (Other developed markets): 5 points</li>
                    <li>Tier 4 (Emerging markets): 3 points</li>
                  </ul>
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Technical Fit</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>AI-verified strong technical alignment: 8 points</li>
                    <li>AI-verified moderate alignment: 5 points</li>
                    <li>Basic alignment: 3 points</li>
                    <li>Unknown/No alignment: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Opportunity Quality</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>AI-verified high potential: 7 points</li>
                    <li>AI-verified medium potential: 5 points</li>
                    <li>Basic potential: 3 points</li>
                    <li>Low/Unknown potential: 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* AI Analysis Impact */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">AI Analysis Impact</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Our AI system analyzes leads across multiple dimensions to provide accurate scoring and insights:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Message Analysis</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Evaluates communication quality and professionalism</li>
                  <li>Identifies specific pain points and requirements</li>
                  <li>Assesses project scope and complexity</li>
                  <li>Influences engagement and BANT scores</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Company Research</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Validates company information</li>
                  <li>Analyzes market presence and potential</li>
                  <li>Evaluates technical compatibility</li>
                  <li>Influences account and market scores</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScoringGuide;
