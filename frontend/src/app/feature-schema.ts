export type Feature = {
  name: string;
  label: string;
  kind: 'number';
  required: boolean;
  min?: number;
  max?: number;
};

// All 44 raw input fields of the trained model (exact training order).
export const FEATURES: Feature[] = [
  { name: 'frame_length', label: 'Frame length', kind: 'number', required: true, min: 42 },
  { name: 'ip_length', label: 'IP length', kind: 'number', required: true, min: 0 },
  { name: 'ip_ttl', label: 'IP TTL', kind: 'number', required: true, min: 0 },
  { name: 'ip_flags', label: 'IP flags', kind: 'number', required: true, min: 0 },
  { name: 'ip_frag_offset', label: 'IP frag offset', kind: 'number', required: true, min: 0 },
  { name: 'ip_dscp', label: 'IP dscp', kind: 'number', required: true, min: 0 },
  { name: 'ip_version', label: 'IP version', kind: 'number', required: true, min: 0 },
  { name: 'tcp_length', label: 'TCP length', kind: 'number', required: true, min: 0 },
  { name: 'tcp_window_size', label: 'TCP window size', kind: 'number', required: true, min: 0 },
  { name: 'tcp_flags', label: 'TCP flags', kind: 'number', required: true, min: 0 },
  { name: 'tcp_syn', label: 'TCP syn', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'tcp_ack', label: 'TCP ack', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'tcp_fin', label: 'TCP fin', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'tcp_rst', label: 'TCP rst', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'tcp_dst_port', label: 'TCP dst port', kind: 'number', required: true, min: 0 },
  { name: 'tcp_src_port_ephemeral', label: 'TCP src port ephemeral', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'udp_length', label: 'UDP length', kind: 'number', required: true, min: 0 },
  { name: 'udp_dst_port', label: 'UDP dst port', kind: 'number', required: true, min: 0 },
  { name: 'icmp_type', label: 'ICMP type', kind: 'number', required: true, min: 0 },
  { name: 'dst_port_well_known', label: 'Dst port well known', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'payload_ratio', label: 'Payload ratio', kind: 'number', required: true, min: 0 },
  { name: 'frame_layers_count', label: 'Frame layers count', kind: 'number', required: true, min: 3 },
  { name: 'is_tcp', label: 'Is tcp', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'is_udp', label: 'Is udp', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'is_icmp', label: 'Is icmp', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'is_arp', label: 'Is arp', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'is_http', label: 'Is http', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'is_dns', label: 'Is dns', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'is_broadcast', label: 'Is broadcast', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'info_length', label: 'Info length', kind: 'number', required: true, min: 0 },
  { name: 'info_word_count', label: 'Info word count', kind: 'number', required: true, min: 0 },
  { name: 'http_method_code', label: 'HTTP method code', kind: 'number', required: true, min: 0 },
  { name: 'http_response_code', label: 'HTTP response code', kind: 'number', required: true, min: 0 },
  { name: 'http_content_length', label: 'HTTP content length', kind: 'number', required: true, min: 0 },
  { name: 'http_uri_length', label: 'HTTP URI length', kind: 'number', required: true, min: 0 },
  { name: 'http_uri_special_chars', label: 'HTTP URI special chars', kind: 'number', required: true, min: 0 },
  { name: 'http_has_sql_keyword', label: 'HTTP has sql keyword', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'http_has_script_tag', label: 'HTTP has script tag', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'http_has_cookie', label: 'HTTP has cookie', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'http_has_user_agent', label: 'HTTP has user agent', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'dns_query_length', label: 'DNS query length', kind: 'number', required: true, min: 0 },
  { name: 'dns_query_type_code', label: 'DNS query type code', kind: 'number', required: true, min: 0, max: 1 },
  { name: 'ethernet_type_code', label: 'Ethernet type code', kind: 'number', required: true, min: 1 },
  { name: 'protocol_code', label: 'Protocol code', kind: 'number', required: true, min: 0 },
];
